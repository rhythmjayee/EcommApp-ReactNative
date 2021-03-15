import expressJwt from 'express-jwt';


const auth = () => {
    const  secret =process.env.SECERT;
    const  api=process.env.API_URL;
     return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/,methods: ['GET', 'OPTIONS']},
            {url:/\/api\/v1\/products(.*)/,methods: ['GET', 'OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/,methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

const isRevoked =(req,payload,done) =>{
    if(!payload.isAdmin){
        done(null,true);
    }
    done();
}

export default auth;