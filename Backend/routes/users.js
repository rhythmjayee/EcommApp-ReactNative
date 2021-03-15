import express from 'express';
import bcrypt from 'bcryptjs';

import User from '../models/user.js';


const router = express.Router();


// router.get('/',async (req,res)=>{
//     try{
//         const categoryList = await Category.find();
//         res.status(200).send(categoryList);

//     }catch(err){
//         res.status(500).json({
//                 error:err,
//                 success:false
//             })
//     }
    
// });

// router.get('/:id', async (req,res)=>{
//     try{ 
//         const result = await Category.findById(req.params.id);

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

router.post('/', async (req,res)=>{
    try{
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                passwordHash:req.body.passwordHash,
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