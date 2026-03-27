import type { Request, Response } from "express";
import Contact from "../models/contactModel.ts";

export const AddtoContact=async(req:Request,res:Response)=>{
    try {
        const {email,name,phone,message,subject} = req.body;

          if (!email || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, name and message are required",
      });
    }
    const count = await Contact.countDocuments({ email });
  if (count >= 3) {
      return res.status(429).json({
        success: false,
        message: "Limit reached (max 3 requests)",
      });
    }

     const newContact = await Contact.create({
      email,
      name,
      phone,
      message,
      subject,
    });

        res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
    });


    } catch (error) {
          console.error("Add Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
    }
}

export const getAllContact = async(req:Request,res:Response)=>{
try {
    const data = await Contact.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: data.length,
      contacts: data,
    });

} catch (error) {
     res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
}
}

export const deleteContact = async(req:Request,res:Response)=>{
try {
    const { id } = req.params;

    // 🔒 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    // 🔹 Delete contact
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: deleted,
    });

  } catch (error) {
    console.error("Delete Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
}
