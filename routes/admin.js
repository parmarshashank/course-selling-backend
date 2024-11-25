const {Router}= require("express");
const {adminModel, courseModel}= require("../db");
const jwt= require("jsonwebtoken");
const {z}= require("zod");
const bcrypt= require("bcrypt");
const {adminMiddleware} = require("../middlewares/admin");
const adminRouter= Router();
const {JWT_ADMIN_PASSWORD}= require("../config.js");

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

adminRouter.post("/signup", async (req, res)=>{
    try{
        const {email, password, firstName, lastName}= signupSchema.parse(req.body);

        const hashedPass=  await bcrypt.hash(password, 10);
        await adminModel.create({
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
    
adminRouter.post("/signin", async function(req, res){
    try{
        const {email, password}= signinSchema.parse(req.body);
        const user= await adminModel.findOne({
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
        }, JWT_ADMIN_PASSWORD);
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
adminRouter.use(adminMiddleware);

adminRouter.post("/course", async function(req, res){
    const adminId= req.userId;
    const {title, description, imageUrl, price}= req.body;

    const course= await courseModel.create({
        title, description, imageUrl, price, creatorId: adminId,
    });

    res.json({
        message:"Course Created",
        courseId:course._id, 
    })
});

adminRouter.put("/course", function(req, res){

});
module.exports= {adminRouter,};