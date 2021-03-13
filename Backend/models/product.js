import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema= Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    images:[{
        type:String,
        default:''
    }],
    brand:{
        type:String,
        default:''
    },
    price:{
        type: Number,
        default:0
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },

    countInStock:{
        type: Number,
        required: true,
        min:0,
        max:255
    },
    rating:{
        type: Number,
        default:0
    },
    numReviews:{
        type: Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        deafult:false
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals:true
})

const Product = mongoose.model('Product',productSchema);

export default Product;