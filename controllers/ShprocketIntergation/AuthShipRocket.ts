import axios from "axios";
import dotenv from "dotenv"
dotenv.config()

export const generateToken = async () => {
  try {
    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL!,
        password: process.env.SHIPROCKET_PASSWORD!,
      }
    );

     const token = res.data.token;
    return token;
  } catch (err) {
    console.error("Shiprocket Auth Error", err);
  }
}