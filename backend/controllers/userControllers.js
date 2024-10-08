import asyncHandler from "express-async-handler";
import {User} from "../models/userModel.js"
import { generateToken } from "../config/generateToken.js";

export const registerUser = asyncHandler(async(req,res) =>{
    //console.log(req.body)
    const {name,email, password, career, pic} = req.body;
   // console.log(name,email, password, career, pic)
    if(!name || !email || !password ){
        res.status(400);
        throw new Error("Enter all fields please")
    }
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400)
        throw new Error("User already exists");
    }

    const user = await User.create({
        name, email, password, career, pic
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            career: user.career,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else{
        res.status(400);
        throw new Error("Failed to create user")
    }
})

export const authUser = asyncHandler(async(req,res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please enter all fields")
    }
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            career: user.career,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else{
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
})

export const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ? {
        $or:[
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    } : {};

    const users= await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.status(200).json(users);
})