import type { Request, Response } from "express";
import User from "../models/userModel.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import { OAuth2Client } from "google-auth-library";
import Otp from "../models/verifyuserModel.ts";
import { sendMail } from "../helpers/sendMail.ts";


interface AuthRequest extends Request{
      user?: any

}

export const CreateAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Admin already exists" 
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({ 
      name, 
      email, 
      password: hashPassword, 
      role: "admin" 
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const LoginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const getAdmin = await User.findOne({ email, role: "admin" });

    if (!getAdmin) {
      return res.status(404).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }

    // Replace Bun.password.verify with bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, getAdmin.password as string);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { id: getAdmin._id },
      process.env.JWT_SECRET!,
      { expiresIn: "40d" }
    );

  
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 40 * 1000, 
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
    });

  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};
export const getAdmin = async(req:AuthRequest,res:Response)=>{
    try {
        const admin = req.user
        return res.json({success:true,admin})
    } catch (error) {
        
    }
}

export const adminLogout = async(req:Request,res:Response)=>{
try {
      res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    return res.status(200).json({
        success:true,
      message: "Admin logged out successfully",
    })
} catch (error) {
   return res.status(500).json({
      message: "Logout failed",
    }) 
}
}



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

  
    const user = await User.findOne({ email,role:"user"});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password!);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    const userToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "40d" }
    );

    
    res.cookie("user_token", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 40, 
    });

    
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export const sendOtp= async (req:Request,res:Response)=>{
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
   const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(404).json({ message: "Email allready Exist" });
    }




    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    const existingOtp = await Otp.findOne({ email });
   if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.expiresAt = expiresAt;
      await existingOtp.save();
    }
else {
      await Otp.create({
        email,
        otp,
        expiresAt,
      });
    }
    
    await sendMail({ email, otp });
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
}


export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, password, otp, name } = req.body;

    if (!email || !password || !otp || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

   if (password.length > 25 || password.length < 4) {
  return res.status(400).json({
    success: false,
    message: "Password must be between 4 and 25 characters",
  });
}

    // Check if user already exists
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Get OTP record
    const getOtp = await Otp.findOne({ email });
    if (!getOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Compare OTP
    if (String(getOtp.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete OTP after verification
    await getOtp.deleteOne();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      role: "user",
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "40d" }
    );

    // Set cookie
    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 40 * 1000,
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const createUserByGoogle= async(req:Request,res:Response)=>{
  try {
    
  const { token } = req.body;

        const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

 const payload = ticket.getPayload();

const email = payload?.email;
const name = payload?.name;
let allready = await User.findOne({email});
if(!allready){
allready =  await User.create({email,name,role:"user"})
}
 const usertoken = jwt.sign(
      { id: allready._id },
      process.env.JWT_SECRET!,
      { expiresIn: "40d" }
    );

     res.cookie("user_token", usertoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 24 * 40 * 1000,
    });

 return res.status(201).json({
      success: true,
      message: "Account login successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



export const getUser = async(req:AuthRequest,res:Response)=>{
    try {
        const user = req.user

        return res.json({success:true,user})
    } catch (error) {
        
    }
}

export const adminUser = async(req:Request,res:Response)=>{
try {
      res.clearCookie("user_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    return res.status(200).json({
        success:true,
      message: "User logged out successfully",
    })
} catch (error) {
   return res.status(500).json({
      message: "Logout failed",
    }) 
}
}


