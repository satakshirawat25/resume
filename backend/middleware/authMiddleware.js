import user from '../models/userModel.js'
import jwt from JsonWebToken


// tokrn generation

export const protect = async(req,res,next)=>{
    try{
        let token = req.headers.authorization;

        if(token && token.startsWith("Barear")){
            token = token.split(" ")(1);
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await user.findById(decoded.id).select('password')
            next()
        }else{
            res.status(401).json({message:"not authorized,no token found"})
        }

    }catch(error){
        res.status(401).json({
            message:"Token failed",
            error:error.messsage
        })

    }
}