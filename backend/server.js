import dotenv from "dotenv";
import express from "express";
import connectToDb from "./config/database.js";
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());

app.use(session({
  name : "connect.sid",
  secret : process.env.SESSION_SECRET || "some-secret-key",
  resave : false,
  saveUninitialized : false,
  cookie : {
    httpOnly : true,
    secure : false,       
    sameSite : "lax",
    maxAge : null         
  }
}));


app.use("/api/auth", authRoutes);

connectToDb();

const PORT = process.env.PORT ||5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening to ${PORT}`);
});

