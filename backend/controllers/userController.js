
import User from'../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//generate a token from JWT
const generateToken = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'})
}

export const registerUser = async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //chek if user already exist
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:'User already exist'})
        }
        if(password.length < 8){
            return res.status(400).json({success:false,message:"password must be atleast of 8 character"})
        }
    
        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        //create a user in mongodb
        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(201).json({
            is:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })



    }catch(error){
        res.status(500).json({
            message:'Server error',
            error:error.message
        })
    }
}

//login fumction

export const loginUSer = async(req,res)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(500).json({message:"invalid email or password"})
        }

//compare the password
const isMatch = await bcrypt.compare(password,user.password)
if(!isMatch){
    return res.status(500).json({message:'invalid email or password'})
}

res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })

    }catch(error){
        res.status(500).json({
            message:'Server error',
            error:error.message
        })
    }

}

//get user profile function

export const getUserProfile = async(req,res)=>{
    try{
        const user = await user.findById(req.user.id).select("password")
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user)
    }catch(error){
        res.status(500).json({
            message:'Server error',
            error:message.error
        })
    }
}