const express = require("express");
const Router = express.Router;

const userRouter = Router();

userRouter.post("/signup", (req, res)=>{
        const username= req.body.username;
        const password= req.body.password;
    
});
    
userRouter.post("/signin", function(req, res){
    
});
    
userRouter.get("/purchases", function(req, res){
    
});

module.exports = {
    userRouter,
}
