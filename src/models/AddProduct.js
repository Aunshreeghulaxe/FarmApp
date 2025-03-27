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
    priceUnit:{
        type:String,
        required:true
    },
    description:{
        type:Number,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    category:{
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


  // availableStock:{
    //     type:String,
    //     required:false
    // },

        // location:{
    //     type:String,
    //     required:false
    // },