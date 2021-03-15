import expressJwt from 'express-jwt';


const auth = () => {
    const secert =process.env.SECERT;
    return expressJwt({
        secert,
        algorithms: ['HS256']
    })
}

export default auth;