import jwt from "jsonwebtoken";
import User from "../models/User.js";



const protectRoute = async(req,res,next)=>{
    try{
        //get token
        console.log(req.headers)
        const token = req.header("Authorization").replace("Bearer ","");
        console.log(token)
        if(!token) return res.status(401).json({message:"No authentication token, acess denied"});
       // console.log(token)
       console.log(process.env.JWT_SECRET)

        //verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded)

        //find user
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({message: "Token is not valid"});
        console.log(user)

        req.user=user;
        next();
    }catch(error){
        console.log("Authentication error:",error.message);
        res.status(401).json({message: "The Token is not valid"});
    }
};
export default protectRoute;