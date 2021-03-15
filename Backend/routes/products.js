import express from 'express';
import multer from 'multer';
import  fs from 'fs';


import Product from '../models/product.js';
import Category from '../models/category.js';


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// setting config for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString() + '-' + file.originalname)
//     }
// })


// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//         cb(null, true)
//     } else {
//         //reject file
//         cb({message: 'Unsupported file format'}, false)
//     }
// }

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 },
//     fileFilter: fileFilter
// })


const router = express.Router();


router.get('/',async (req,res)=>{
    //http://localhost:3000/api/v1/products?category=604c87821cce7da28ca12cd5,604c8cafcfe79e75d80ce48a
    try{
        let filter={};
        if(req.query.category){
            filter={category:req.query.category.split(',')};
        }
        const products = await Product.find(filter);
        // .select('name image -_id');
        res.send(products);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});
router.get('/:id',async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('category');
        if(!product)
        return res.status(404).json({success:false,message:'Product not found!!'});

        res.send(product);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/get/count',async (req,res)=>{
    try{
        const count = await Product.countDocuments();

        res.send({
            productCount:count
        });

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.get('/get/featured',async (req,res)=>{
    try{
        let count=0;
        if(req.query.count){
            count=req.query.count;
        }
        const products = await Product.find({isFeatured:true}).limit(+count);

        if(!products){
            return res.status(500).send('the product cannot retrived');
        }
        res.send(products);

    }catch(err){
        res.status(500).json({
                error:err,
                success:false
            })
    }
    
});

router.post('/', uploadOptions.single('image') , async (req,res)=>{
    try{
            const category = await Category.findById(req.body.category);
            if(!category){
                return res.status(404).json({
                    error:{message:'Invalid Category'},
                    success:false
                })
            }

            const file=req.file;
            if(!file)
            return res.status(400).json({
                error:{message:'No Image file selected'},
                success:false
            })

            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

            const product = new Product({
                name:req.body.name,
                description:req.body.description,
                richDescription:req.body.richDescription,
                image:`${basePath}${fileName}`,
                brand:req.body.brand,
                price:req.body.price,
                category:req.body.category,
                countInStock:req.body.countInStock,
                rating:req.body.rating,
                numReviews:req.body.numreviews,
                isFeatured:req.body.isFeatured
            });

            const result = await product.save();
            if(!result){
                return res.status(500).send('the product cannot be created');
            }
            res.status(201).send(result);
        }catch(err){
            console.log(err);
            res.status(500).json({
                error:{message:'Error occured'},
                success:false
            })
        }

});

router.put('/gallery-images/:id', uploadOptions.array('images',10), async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                error:{message:'Invalid product'},
                success:false
            })
        }

        const files=req.files;
        console.log(files)
        if(files.length==0)
        return res.status(400).json({
            error:{message:'No Image file selected'},
            success:false
        })

        let imagePaths=[];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        files.map(file=>{
            imagePaths.push(`${basePath}${file.filename}`)
        })


        const result = await Product.findByIdAndUpdate(req.params.id,{
            images:imagePaths
        },
        {new:true});

        if(!result){
            return res.status(500).send('the product cannot be updated');
        }
        res.status(201).send(result);
    }catch(err){
        console.log(err);
        res.status(500).json({
            error:{message:'Error occured'},
            success:false
        })
    }
});

// https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud#step_2_set_up_file_uploads_to_cloudinary
// https://medium.com/the-andela-way/how-to-upload-multiple-images-using-cloudinary-and-node-js-2f053b167b80#:~:text=Make%20sure%20you%20have%20NodeJS,is%20a%20very%20quick%20process.&text=After%20running%20all%20the%20commands,Create%20files%20called%20app.

// const fileUpload = multer();
// import cloudinary from 'cloudinary';
// const cd=cloudinary.v2;
// cloudinary.config({ 
//     cloud_name: 'rhythmjayee', 
//     api_key: '923146249665956', 
//     api_secret: 'x7GssAf08MJANeYgUAqur9u1evo' 
//   });
// // import streamifier from 'streamifier';

// const uploads = (file, folder) => {
//     return new Promise(resolve => {
//         cloudinary.uploader.upload(file, (result) => {
//             resolve({
//                 url: result.url,
//                 id: result.public_id
//             })
//         }, {
//             resource_type: "auto",
//             folder: folder
//         })
//     })
// }

// router.put('/gallery-images/cloud/:id', upload.array('images'), async (req,res)=>{
//     //API_KEY=923146249665956
//     //CLOUD_NAME=rhythmjayee
//     // /CLOUDINARY_URL=cloudinary://923146249665956:x7GssAf08MJANeYgUAqur9u1evo@rhythmjayee
//     try{
//         const product = await Product.findById(req.params.id);
//         if(!product){
//             return res.status(404).json({
//                 error:{message:'Invalid product'},
//                 success:false
//             })
//         }

//         const files=req.files;
//         console.log(files)
//             // if(!file)
//             // return res.status(400).json({
//             //     error:{message:'No Image file selected'},
//             //     success:false
//             // })
//         if(files.length==0)
//         return res.status(400).json({
//             error:{message:'No Image file selected'},
//             success:false
//         });

//         const uploader = async (path) => await uploads(path, 'Images');

//                 const urls = []
//                 for (const file of files) {
//                 const { path } = file;
//                 const newPath = await uploader(path)
//                 urls.push(newPath)
//                 // fs.unlinkSync(path)
//                 }

//                 res.status(200).json({
//                 message: 'images uploaded successfully',
//                 data: urls
//                 })


        // let imagePaths=[];
        // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        // files.map(file=>{
        //     imagePaths.push(`${basePath}${file.filename}`)
        // })


        // const result = await Product.findByIdAndUpdate(req.params.id,{
        //     images:imagePaths
        // },
        // {new:true});

        // if(!result){
        //     return res.status(500).send('the product cannot be updated');
        // }
        // res.status(201).send(result);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             error:{message:'Error occured'},
//             success:false
//         })
//     }
// });

router.put('/:id', async (req,res)=>{
    try{
        const category = await Category.findById(req.body.category);
        if(!category){
            return res.status(404).json({
                error:{message:'Invalid Category'},
                success:false
            })
        }

        const result = await Product.findByIdAndUpdate(req.params.id,{
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numreviews,
            isFeatured:req.body.isFeatured
        },{new:true});

        if(!result){
            return res.status(500).send('the product cannot be updated');
        }
        res.status(201).send(result);
    }catch(err){
        res.status(500).json({
            error:{message:'Error occured'},
            success:false
        })
    }

});

router.delete('/:id', async (req,res)=>{
    try{ 
        const result = await Product.findByIdAndDelete(req.params.id);

        if(result)
        return res.status(201).json({success:true,message:'Product deleted successfully!!'});
        else
        return res.status(404).json({success:false,message:'Product not found!!'})

    }catch(err){
        res.status(500).json({
            error:{message:'Error occured in deleting product'},
            success:false
        })
    }

});


export default router;