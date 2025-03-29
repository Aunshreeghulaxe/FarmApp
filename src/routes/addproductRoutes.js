import express from "express";
import cloudinary from "../lib/cloudinary.js"
import Product from "../models/AddProduct.js";
import protectRoute from "../middleware/auth.middleware.js";




const router = express.Router();

router.post("/",protectRoute,async(req,res)=>{
    try{
        const { productName,price,description, productImage,priceUnit,category}=req.body;
        
        if(!productImage || !productName || !price || !description || !priceUnit || !category){
            return res.status(400).json({message: "Please provide all feilds"});
        }

        //upload the image to cloudinary
         const uploadResponse = await cloudinary.uploader.upload(productImage);
         const  imageUrl = uploadResponse.secure_url
         
        //save to database
        const newProduct = new Product({
            productName,
            price,
            description,
            productImage:imageUrl,
            priceUnit,
            category, 
            user: req.user._id

        })
        // productImage:imageUrl,
        await newProduct.save();

        res.status(201).json(newProduct);

    }catch(error){
        console.log("Error creating Product",error);
        res.status(500).json({message: error.message});

    }
})

//pagination => infinite loading
router.get("/",protectRoute,async(req,res)=>{
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit ||5;
        const skip = (page-1)*limit;

        const products = await Product.find()
        .sort({createdAt: -1})//desc
        .skip(skip)
        .limit(limit)
        .populate("user","username profileImage");
         
        const totalProducts = await Product.countDocuments();
        
        res.send({
            products,
            currentPage:page,
            totalProducts,
            totalPages:Math.ceil(totalProducts/limit)
        });
    
    }catch(error){
        console.log("Error to get all products route",error);
        res.status(500).json({message: "Internal server error"});
    }
})

//get recommended products by the logged in user
router.get("/user",protectRoute,async(req,res)=>{
    try{
       const Products = await Product.find({user:req.user._id}).sort({createdAt:-1});
       res.json(Products);
    }catch(error){
        console.log("Get user book error",error.message);
        res.status(500).json({message: "erver error"});
    }
})



router.delete("/:id",protectRoute,async(req,res)=>{
    try{
        const Product = await Product.findById(req.params.id);
        if(!Product) return res.status(400).json({message:"Product not found"});

        //check if user is the creator of the book
        if(Product.user.toString() !== req.user._id.toString())
            return res.status(401).json({message:"Unathorized"});

        //delete image from cloudinary as well
        if(Product.productImage && Product.productImage.includes("cloudinary")){
            try{
                const publicId = Product.productImage.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }catch(deleteError){
                console.log("Error deleting image from cloudinary",deleteError);
            }
            }

            await Product.deleteOne();
            res.json({message: "Product delted Successfully"});
        }catch(error){
            console.log("Error deleting Product",error);
            res.status(500).json({message: "Internal server error"});

        }
     });



export default router;