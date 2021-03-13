import express from 'express';

import Product from '../models/product.js';


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
            const product = new Product({
                name:req.body.name,
                image:req.body.image,
                countInStock:req.body.countInStock
            });

            const result = await product.save();
            if(!result){
                return res.status(404).send('the product cannot be created');
            }
            res.status(201).json(result);
        }catch(err){
            res.status(500).json({
                error:{message:'Error occured'},
                success:false
            })
        }

});


export default router;