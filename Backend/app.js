// const express= require('express');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';



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




app.get(`${api}/products`,(req,res)=>{
    const products={
        id:'sadfsdgs',
        name:'table'
    }
    res.send(products);
});

app.post(`${api}/products`,(req,res)=>{
    const newProduct=req.body;
    console.log(newProduct);
    res.send(newProduct);
});











app.listen(3000,()=>{
    console.log('server running at PORT 3000');
})