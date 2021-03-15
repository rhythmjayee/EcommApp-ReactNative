import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderItemSchema= Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
});

const OrderItem = mongoose.model('OrderItem',orderItemSchema);

export default OrderItem;