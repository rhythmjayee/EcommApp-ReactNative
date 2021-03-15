const errorHandler = (err,req,res,next) =>{
    if(err.name=== 'UnauthorizedError'){
        return res.status(401).send({
            error:{
                message:'User is not Authorized'
            }
        })
    }
    else if(err.name=== 'ValidationError'){
        return res.status(401).send({
            error:{
                message:err.message
            }
        })
    }

    return res.status(500).send({
        error:{
            message:err.message
        }
    });
}

export default errorHandler;