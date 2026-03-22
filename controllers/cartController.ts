import type { Request, Response } from "express";
import Cart from "../models/cartModel.ts";
import Wishlist from "../models/wishlistModel.ts";
interface AuthRequest extends Request{
      user?: any

}

export const addToCart = async(req:AuthRequest,res:Response)=>{
    try {
 const user = req.user;
 const {productid , quantity =1 ,size,  price} = req.body

    if (!productid || !price) {
      return res.status(400).json({ success:false, message: "Product and price are required" });
    }


let cart =  await Cart.findOne({
    user:user._id
})

if(!cart){
  cart = await Cart.create({
        user: user._id,
        items: [
          {
            product: productid,
            quantity,
            size,
            price,
          },
        ],
        totalPrice: quantity * price,
      });
return res.status(201).json({
    success:true,
        message: "Product added to cart",
        cart,
      });

}


 const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.product.toString() === productid &&
        item.size === size
    );

    if (itemIndex > -1) {
      // Increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productid,
        quantity,
        size,
        price,
      });
    }
        

     cart.totalPrice = cart.items.reduce(
      (total: number, item: any) =>
        total + item.quantity * item.price,
      0
    );

    await cart.save();

     res.status(200).json({
         success:true,
      message: "Product added to cart",
     
    });
    } catch (error) {
        console.error(error);
    res.status(500).json({ success:false, message: "Server error" });
    }
}



export const getCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: "items.product",
        select: "title sellingPrice images slug",
      });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      items:cart,
      success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const itemIncremant = async(req: AuthRequest, res: Response)=>{
 try {
   const cartItemId = req.params.id;
    const user = req.user;
  
    const cart = await Cart.findOne({ user: user._id });
 if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item: any) => item._id.toString() === cartItemId
    );
if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
 item.quantity += 1;
    cart.totalPrice += item.price;


await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item quantity increased",
      cart,
    });



 } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });

 } 
}

export const itemDecrement = async(req: AuthRequest, res: Response)=>{
 try {
   const cartItemId = req.params.id;
    const user = req.user;
  
    const cart = await Cart.findOne({ user: user._id });
 if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item: any) => item._id.toString() === cartItemId
    );
if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if(item.quantity ==1){
      return 
    }

 item.quantity -= 1;
    cart.totalPrice -= item.price;


await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item quantity decreses",
      cart,
    });



 } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });

 } 
}

export const deletCartitem = async(req: AuthRequest, res: Response)=>{
  try {
     const cartItemId = req.params.id;
    const user = req.user;
  
    const cart = await Cart.findOne({ user: user._id });
 if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item: any) => item._id.toString() === cartItemId
    );
if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
 cart.items = cart.items.filter(
      (itm: any) => itm._id.toString() !== cartItemId
    );
   cart.totalPrice -= item.quantity * item.price;
    if (cart.totalPrice < 0) cart.totalPrice = 0;

 await cart.save()
return res.status(200).json({
      success: true,
      message: "Cart item deleted",
      cart,
    });
  } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });

  }
}

export const deletCartitems = async(req: AuthRequest, res: Response)=>{
  try {
   
    const user = req.user;
  
    const cart = await Cart.findOne({ user: user._id });
 if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

   

 cart.items =[ ]
  cart.totalPrice =0

 await cart.save()
return res.status(200).json({
      success: true,
    
  
    });
  } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });

  }
}

export const addtoWishlist=async(req: AuthRequest, res: Response)=>{
try {
  const cartItemId = req.params.id;
  const user = req.user;

  const cart = await Cart.findOne({ user: user._id });

 if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }


     


    const item = cart.items.find(
      (item: any) => item._id.toString() === cartItemId
    );



if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }


const productId = item.product;
 let wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: user._id,
        items: [],
      });
    }

const alreadyExists = wishlist.items.some(
      (id: any) => id.toString() === productId.toString()
    );

    if (!alreadyExists) {
      wishlist.items.push(productId);
      await wishlist.save();
    }


 cart.items = cart.items.filter(
      (itm: any) => itm._id.toString() !== cartItemId
    );
   cart.totalPrice -= item.quantity * item.price;
    if (cart.totalPrice < 0) cart.totalPrice = 0;

 await cart.save()

 return res.status(200).json({
      success: true,
      message: "Item moved to wishlist successfully",
    });
} catch (error) {
   return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
}
}
