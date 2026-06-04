import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  // Basic Information
  title: string;
  slug: string;
  sku: string;

  costPrice: number;
  sellingPrice: number;
  compareAtPrice?: number; // Original price for showing discounts
  profitMargin: number; // Virtual field

  // Inventory
  quantity: number;
  inStock: boolean; // Virtual field

  // Product Details
  description: string;
  shortDescription?: string;
  specifications?: Map<string, string>; // Key-value pairs for specs
  features: string[];

  // Categorization
  categories: Types.ObjectId[];
  tags: string[];
  size: string[];

  // Media
  images: string[];
  thumbnail?: string; // Virtual field
  productfor: "male" | "female" | "both",
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  // Status & Flags
  status: 'draft' | 'active' | 'archived' | 'out_of_stock';
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;

  // Shipping
  shipping: {
    weight: number; // in grams
    dimensions: {
      length: number; // in cm
      width: number;
      height: number;
    };
    isFreeShipping: boolean;
  };

  viewCount: number;
  orderCount: number;
color:string;


}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [50, "SKU cannot exceed 50 characters"],
    },

    // Pricing
    costPrice: {
      type: Number,
      required: true,
      min: [0, "Cost price cannot be negative"],
      set: (v: number) => Math.round(v * 100) / 100, // Store as cents
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: [0, "Selling price cannot be negative"],
      set: (v: number) => Math.round(v * 100) / 100,
    },
    compareAtPrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
      set: (v: number) => Math.round(v * 100) / 100,
    },


    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },



    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    features: {
      type: [String],
      default: [],
    },

    categories: [{
      type: Schema.Types.ObjectId,
      ref: "categories",
      }],

    tags: {
      type: [String],
      trim: true,
      lowercase: true,
      default: [],
    },
     size: {
      type: [String],
      trim: true,
      lowercase: true,
      default: [],
    },


    thumbnail:{type:String},
    images: [String],


    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [{
        type: String,
        trim: true,
        lowercase: true,
      }],
    },

    productfor: {
      type: String,
      enum: ["male", "female", "both"],
      default: "female"
    },


    status: {
      type: String,
      enum: {
        values: ['draft', 'active', 'archived', 'out_of_stock'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    shipping: {
      weight: {
        type: Number,
        min: 0,
        default: 0,
      },
      dimensions: {
        length: { type: Number, min: 0, default: 0 },
        width: { type: Number, min: 0, default: 0 },
        height: { type: Number, min: 0, default: 0 },
      },
      isFreeShipping: {
        type: Boolean,
        default: false,
      },
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },

 color:{
    type:String,
    default:"#000"
  },
  },
 
  {
    timestamps: true,
  }
);

// Virtuals
productSchema.virtual('profitMargin').get(function (this: IProduct) {
  if (this.costPrice === 0) return 0;
  return ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
});





productSchema.virtual('discountPercentage').get(function (this: IProduct) {
  if (!this.compareAtPrice || this.compareAtPrice <= this.sellingPrice) return 0;
  return Math.round(((this.compareAtPrice - this.sellingPrice) / this.compareAtPrice) * 100);
});



productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ orderCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });



// Static method to find featured products
productSchema.statics.findFeatured = function () {
  return this.find({
    status: 'active',
    isFeatured: true,
    'inventory.quantity': { $gt: 0 }
  }).sort({ orderCount: -1 }).limit(10);
};

// Static method to find best sellers
productSchema.statics.findBestSellers = function (limit = 10) {
  return this.find({
    status: 'active',
    isBestSeller: true
  }).sort({ orderCount: -1 }).limit(limit);
};

// Static method to search products
productSchema.statics.search = function (query: string) {
  return this.find({
    status: 'active',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
      { 'seo.keywords': { $regex: query, $options: 'i' } }
    ]
  });
};

const Product = model<IProduct>("Product", productSchema);

export default Product;