import express from 'express';

import Product from '../models/product.js';
import Category from '../models/category.js';



const router = express.Router();


router.get('/',async (req,res)=>{
    try{
        const products = await Product.find();
        res.send(products);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.post('/', async (req,res)=>{
    try{
            const category = await Category.findById(req.body.category);
            if(!category){
                return res.status(404).json({
                    error:{message:'Invalid Category'},
                    success:false
                })
            }
            const product = new Product({
                name:req.body.name,
                description:req.body.description,
                richDescription:req.body.richDescription,
                image:req.body.image,
                brand:req.body.brand,
                price:req.body.price,
                category:req.body.category,
                countInStock:req.body.countInStock,
                rating:req.body.rating,
                numReviews:req.body.numreviews,
                isFeatured:req.body.isFeatured
            });

            const result = await product.save();
            if(!result){
                return res.status(500).send('the product cannot be created');
            }
            res.status(201).send(result);
        }catch(err){
            res.status(500).json({
                error:{message:'Error occured'},
                success:false
            })
        }

});


export default router;