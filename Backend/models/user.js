import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema= Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    phone:{
        type:String,
        required:true
    },
    street:{
        type: String,
        default:''
    },
    apartment:{
        type:String,
        default:''
    },
    zip:{
        type: String,
        default:''
    },
    city:{
        type: String,
        default:''
    },
    country:{
        type: String,
        default:''
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON',{
    virtuals:true
})

const User = mongoose.model('User',userSchema);

export default User;