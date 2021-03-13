// const express= require('express');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';


import  productRouter from './routes/products.js';
import categoryRouter from './routes/categories.js'


dotenv.config({ silent: process.env.NODE_ENV === 'development' });

//DB connection
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
app.use(cors());
app.options('*',cors());


//Routers
app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,categoryRouter);

















app.listen(3000,()=>{
    console.log('server running at PORT 3000');
})