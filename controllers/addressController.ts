import type { Request, Response } from "express";
import Address from "../models/addressModel.ts";
import axios from "axios";
import { generateToken } from "./ShprocketIntergation/AuthShipRocket.ts";

interface AuthRequest extends Request {
    user: any
}

export const createAddress = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { firstName, lastName, phoneNumber, street1, street2, city, state, zipCode, country, label, isDefault } = req.body
        if (!firstName || !lastName || !phoneNumber || !street1 || !city || !state || !zipCode) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled",
            });
        }

const token = await  generateToken();

const shiprocketRes = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability`,
    {
      params: {
        pickup_postcode: "160011", 
        delivery_postcode: zipCode,
        weight: 2,
        cod: 0,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
    const couriers = shiprocketRes?.data?.data?.available_courier_companies || [];


if(couriers.length === 0 ){
  return res.status(400).json({
        success: false,
        message: "Delivery not available on this pincode",
      });

}
        const existingAddress = await Address.findOne({ user: user._id });


        let defaultStatus = false;
        if (!existingAddress) {

            defaultStatus = true;
        }

        if (isDefault) {
            // Remove default from other addresses
            await Address.updateMany(
                { user: user._id },
                { $set: { isDefault: false } }
            );
            defaultStatus = true;
        }


        const newAddress = await Address.create({
            firstName,
            lastName,
            phoneNumber,
            street1,
            street2,
            city,
            state,
            zipCode,
            country,
            label,
            isDefault: defaultStatus,
            user: user._id,
        });




        res.status(201).json({
            success: true,
            message: "Address created successfully",
            address: newAddress,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create address",
        });
    }
}

export const getAddress = async(req: AuthRequest, res: Response)=>{
    try {
        const user = req.user;
 if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    const addresses = await Address.find({user:user._id}).sort({ isDefault: -1, createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      addresses,
    });

    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
    }
}

export const deletAddress = async(req: AuthRequest, res: Response)=>{
    try {
        const id =  req.params.id;
        const user = req.user

            if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

     const address = await Address.findOne({_id:id,user:user._id})
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    // Delete address
    await address.deleteOne();

    // 🔥 If deleted address was default
    if (wasDefault) {
      const anotherAddress = await Address.findOne({
        user: user._id,
      }).sort({ createdAt: -1 });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

     return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });


    } catch (error) {
        return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
    }
}

export const setDefault= async(req: AuthRequest, res: Response)=>{
    try {
         const id =  req.params.id;
        const user = req.user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    const address = await Address.findOne({
      _id: id,
      user: user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

     await Address.updateMany(
      { user: user._id },
      { $set: { isDefault: false } }
    );

   address.isDefault = true;
    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
     
    });

    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Failed to update default address",
    });
    }
}

