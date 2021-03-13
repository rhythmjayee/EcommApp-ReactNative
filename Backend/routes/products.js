import express from 'express';

import Product from '../models/product.js';
import Category from '../models/category.js';



const router = express.Router();


router.get('/',async (req,res)=>{
    //http://localhost:3000/api/v1/products?category=604c87821cce7da28ca12cd5,604c8cafcfe79e75d80ce48a
    try{
        let filter={};
        if(req.query.category){
            filter={category:req.query.category.split(',')};
        }
        const products = await Product.find(filter);
        // .select('name image -_id');
        res.send(products);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});
router.get('/:id',async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('category');
        if(!product)
        return res.status(404).json({success:false,message:'Product not found!!'});

        res.send(product);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/get/count',async (req,res)=>{
    try{
        const count = await Product.countDocuments();

        res.send({
            productCount:count
        });

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/get/featured',async (req,res)=>{
    try{
        let count=0;
        if(req.query.count){
            count=req.query.count;
        }
        const products = await Product.find({isFeatured:true}).limit(+count);

        if(!products){
            return res.status(500).send('the product cannot retrived');
        }
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

router.put('/:id', async (req,res)=>{
    try{
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.status(404).json({
                error:{message:'Invalid Category'},
                success:false
            })
        }

        const result = await Product.findByIdAndUpdate(req.params.id,{
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
        },{new:true});

        if(!result){
            return res.status(500).send('the product cannot be updated');
        }
        res.status(201).send(result);
    }catch(err){
        res.status(500).json({
            error:{message:'Error occured'},
            success:false
        })
    }

});

router.delete('/:id', async (req,res)=>{
    try{ 
        const result = await Product.findByIdAndDelete(req.params.id);

        if(result)
        return res.status(201).json({success:true,message:'Product deleted successfully!!'});
        else
        return res.status(404).json({success:false,message:'Product not found!!'})

    }catch(err){
        res.status(500).json({
            error:{message:'Error occured in deleting product'},
            success:false
        })
    }

});


export default router;