// const express= require('express');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';


import DBconnect from './DBconnection.js'
import  productRouter from './routes/products.js';
import categoryRouter from './routes/categories.js'
import userRouter from './routes/users.js'
import orderRouter from './routes/orders.js'



import auth from './middleware/jwt.js';
import errorHandler from './middleware/errorHandler.js';



dotenv.config({ silent: process.env.NODE_ENV === 'development' });

//DB connection
DBconnect();


// variables
const api=process.env.API_URL;
const app= express();



//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny')); 
app.use(cors());
app.options('*',cors());
app.use(auth());
app.use(errorHandler);



//Routers
app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,categoryRouter);
app.use(`${api}/users`,userRouter);
app.use(`${api}/orders`,orderRouter);






app.listen(3000,()=>{
    console.log('server running at PORT 3000');
});