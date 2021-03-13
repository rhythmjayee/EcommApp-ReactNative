import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema= Schema({
    name:String,
    image:String,
    countInStock:Number
});

const Product = mongoose.model('Product',productSchema);

export default Product;