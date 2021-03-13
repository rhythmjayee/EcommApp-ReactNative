// const express= require('express');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';


import Product from './models/product.mjs';

dotenv.config({ silent: process.env.NODE_ENV === 'development' });
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    })
    .then(con=>{
        console.log('database connected!!')
    })
    .catch(err=>{
        console.log('DB connection failed!!')
    });


// variables
const api=process.env.API_URL;
const app= express();



//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny')); 




app.get(`${api}/products`,async (req,res)=>{
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

app.post(`${api}/products`, async (req,res)=>{
    try{
            const product = new Product({
                name:req.body.name,
                image:req.body.image,
                countInStock:req.body.countInStock
            });

            const result = await product.save();
            res.status(201).json(result);
        }catch(err){
            res.status(500).json({
                error:err,
                success:false
            })
        }

});











app.listen(3000,()=>{
    console.log('server running at PORT 3000');
})