import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import orderRouter from "./routes/orderRoute.js";
import foodCategoryRouter from "./routes/foodCategoryRoute.js";
import addressRouter from "./routes/addressRoute.js";
import bodyParser from "body-parser";
//=================================================================

//app config
const app = express();
const port = 4000;
app.use(bodyParser.json());

//middleware
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://food-delivery-application-ma.vercel.app",
    credentials: true,
  })
);

//db connection
connectDB();

//api endpoints
app.use("/api/foodcategory", foodCategoryRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
