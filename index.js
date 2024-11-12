const express = require("express");
const app = express();
const env= require("dotenv");
const {userRouter}= require("./routes/user");
const {courseRouter}= require("./routes/course");
const {adminRouter}= require("./routes/admin");

app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

app.listen(3000);