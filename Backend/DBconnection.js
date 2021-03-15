import mongoose from 'mongoose';

const connect = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            });

            console.log('database connected!!')
    }catch(err){
        console.log('DB connection failed!!')
    }
}

export default connect;