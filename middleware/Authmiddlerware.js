import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authentication = asyncHandler(async (req, res, next) => {
  // console.log(req.headers.authorization,'req')
  let token;
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //  console.log(token,'token')

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      //  console.log(decode,'decode')
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ message: "Not Authorized, token failed" });
      //  console.log(err);
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not Authorized, no token" });
  }
});

export { authentication };
