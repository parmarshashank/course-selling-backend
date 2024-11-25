const express = require("express");
const app = express();
require("dotenv").config();
const {userRouter}= require("./routes/user");
const {courseRouter}= require("./routes/course");
const {adminRouter}= require("./routes/admin");
const mongoose = require("mongoose");

app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter); 
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("server started at port 3000")
} 

main();


