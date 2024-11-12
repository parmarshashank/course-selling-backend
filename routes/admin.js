const {Router}= require("express");
const adminRouter= Router();

adminRouter.post("/signup", (req, res)=>{
    const username= req.body.username;
    const password= req.body.password;

});

adminRouter.post("/signin", function(req, res){

});

adminRouter.use(adminMiddleware);

adminRouter.post("/course", function(req, res){

});

adminRouter.post("/change", function(req, res){

});
module.exports= {adminRouter,};