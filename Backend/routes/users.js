import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';


const router = express.Router();


router.get('/',async (req,res)=>{
    try{
        const userList = await User.find().select('-passwordHash');
        res.status(200).send(userList);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/:id', async (req,res)=>{
    try{ 
        const result = await User.findById(req.params.id).select('-passwordHash');;

        if(!result)
        return res.status(404).json({success:false,message:'Category not found!!'})

        res.status(200).send(result);

    }catch(err){
        res.status(500).json({
            error:{message:'Error occured'},
            success:false
        })
    }

});

router.post('/register', async (req,res)=>{
    try{ 
        let isEmailAvaiable = await User.findOne({email:req.body.email});

        if(isEmailAvaiable){
            return res.status(400).json({
                error:{
                    message:'Email Id is already exist'
                },
                sucess:false
            });
        }
        let hash=bcrypt.hashSync(req.body.password,10);
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                passwordHash:hash,
                phone:req.body.phone,
                isAdmin:req.body.isAdmin,
                apartment:req.body.apartment,
                zip:req.body.zip,
                city:req.body.city,
                country:req.body.country
            });

            const result = await user.save();

            if(!result){
                return res.status(404).send('the user cannot be created');
            }
            res.status(201).json(result);

        }catch(err){
            res.status(500).json({
                error:err,
                success:false
            })
        }

});

router.post('/login', async (req,res)=>{
    try{

        let isEmailAvaiable = await User.findOne({email:req.body.email});

        if(!isEmailAvaiable){
            return res.status(400).json({
                error:{
                    message:'Email Id is not registered'
                },
                sucess:false
            });
        }

        let isPasswordCorrect= bcrypt.compareSync(req.body.password,isEmailAvaiable.passwordHash);
        
        if(!isPasswordCorrect){
            return res.status(400).json({
                error:{
                    message:'Invalid Password'
                },
                sucess:false
            });
        }

            const token=jwt.sign(
                {
                    userId:isEmailAvaiable.id,
                    isAdmin:isEmailAvaiable.isAdmin
                },
                process.env.SECERT,
                {expiresIn:'1d'}
            )

            if(!token){
                return res.status(500).json({
                    error:{
                        message:'Some error occured in Logining User'
                    },
                    sucess:false,
                })
            }
            res.status(200).send({user:isEmailAvaiable.email,token:token});

        }catch(err){
            res.status(500).send({
                error:{
                    message:err.message
                },
                success:false
            })
        }

});

// router.put('/:id', async (req,res)=>{
//     try{ 
//         const result = await Category.findByIdAndUpdate(req.params.id,{
//             name:req.body.name,
//             icon:req.body.icon,
//             color:req.body.color
//         },{new:true});

//         if(!result)
//         return res.status(404).json({success:false,message:'Category not found!!'})

//         res.status(200).send(result);

//     }catch(err){
//         res.status(500).json({
//             error:{message:'Error occured'},
//             success:false
//         })
//     }

// });

// router.delete('/:id', async (req,res)=>{
//     try{ 
//         const result = await Category.findByIdAndDelete(req.params.id);

//         if(result)
//         return res.status(201).json({success:true,message:'Category deleted successfully!!'});
//         else
//         return res.status(404).json({success:false,message:'Category not found!!'})

//     }catch(err){
//         res.status(500).json({
//             error:{message:'Error occured in deleting category'},
//             success:false
//         })
//     }

// });


export default router;