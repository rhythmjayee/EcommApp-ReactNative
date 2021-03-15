import express from 'express';

import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';



const router = express.Router();


router.get('/',async (req,res)=>{
    try{
        const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1});
        res.status(200).send(orderList);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/:id',async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id)
        .populate('user','name')
        .populate({path:'orderItems', populate:{path:'product',populate:'category'}});// populate orderItems as well as products and categories
        res.status(200).send(order);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.post('/', async (req,res)=>{
    try{

        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })
    
            newOrderItem = await newOrderItem.save();
    
            return newOrderItem._id;
        }))
        const orderItemsIdsResolved =  await orderItemsIds;

            const order = new Order({
                orderItems:  orderItemsIdsResolved,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice:req.body.totalPrice,
                user: req.body.user,
            });

            const result = await order.save();

            if(!result){
                return res.status(404).send('the order cannot be placed');
            }
            res.status(201).json(result);

        }catch(err){
            console.log(err)
            res.status(500).json({
                error:err,
                success:false
            })
        }

});


export default router;