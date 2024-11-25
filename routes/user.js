const express = require("express");
const {userModel}= require("../db.js");
const Router = express.Router;
const jwt= require("jsonwebtoken");
const {z}= require("zod");
const bcrypt= require("bcrypt");

const userRouter = Router();
const {JWT_USER_PASSWORD}= require("../config.js");

const signupSchema= z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string(),
}).strict();

const signinSchema= z.object({
    email: z.string().email(),
    password: z.string().min(8),
}).strict();
userRouter.post("/signup", async (req, res)=>{
    try{
        const {email, password, firstName, lastName}= signupSchema.parse(req.body);

        const hashedPass=  await bcrypt.hash(password, 10);
        await userModel.create({
            email: email,
            password: hashedPass,
            firstName: firstName,
            lastName: lastName,
        });
        res.json({
            message:"Sign up successful"
        })
    }
    catch(error){
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid input",
                errors: error.errors,
            });
        } else {
            res.status(500).json({
                message: "Sign up failed",
            });
        }
    }

});
    
userRouter.post("/signin", async function(req, res){
    try{
        const {email, password}= signinSchema.parse(req.body);
        const user= await userModel.findOne({
            email:email,
        });
        if(!user){
            return res.status(403).json({
                message:"Invalid email or password",
            });
        }
        const isPassValid= await bcrypt.compare(password, user.password);
        if(!isPassValid){
            return res.status(403).json({
                message: "Invalid email or password",
            })
        }
        const token= jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);
        res.json({
            token: token,
        })
    }
    catch(error){
        if(error instanceof z.ZodError){
            res.status(403).json({
                message:" Invalid Input",
                errors: error.errors,
            })
        }
        else{
            res.status(500).json({
                message:" Signin Failed",
            })
        }
    }
});
    
userRouter.get("/purchases", function(req, res){
    
});

module.exports = {
    userRouter,
}
