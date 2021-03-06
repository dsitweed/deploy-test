import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { sessions } from "../config/connectDatabase.js";
import { FAILED } from "../constants/index.js";

export const authenToken = async (req, res, next) => {
  try {
    if (!req.cookies) {
      res.status(401).json({ message: FAILED });
      return;
    }

    const { token } = req.cookies;
    if (!token) {
      console.log("don't have token!");
      res.status(401).json({ message: FAILED });
      return;
    }
    const secretStr = process.env.JWT_SECRET;
    // verify neu token da het han roi thi sao
    const decode = jwt.verify(token, secretStr);
    const { userId } = decode;
    const user = await sessions.findOne({userId: new ObjectId(userId)});
    if (!user) {
      res.status(401).json({ message: FAILED });
      return;
    }
    //if user is defined -> next
    req.userId = userId;
    if (user) next();
  } catch (err) {
    console.log("err: ", err);
  }
};
