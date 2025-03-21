import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    unit:{
        type:Number,
        required:true
    },
    description:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

    }
,{timestamps:true});

const Product = mongoose.model("Product",ProductSchema);

export default Product;