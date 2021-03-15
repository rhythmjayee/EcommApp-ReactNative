import express from 'express';

import Order from '../models/order.js';


const router = express.Router();


router.get('/',async (req,res)=>{
    try{
        const orderList = await Order.find();
        res.status(200).send(orderList);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});


export default router;