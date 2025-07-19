import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import profileRouter from './routes/profileRoute.js';
import postRouter from './routes/postRoute.js';
import commentRouter from './routes/commentRoute.js';
import followRouter from './routes/followRoute.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/follow', followRouter);

// Basic Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});