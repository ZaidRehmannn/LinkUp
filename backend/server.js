import express from 'express'
import dotenv from "dotenv"
import { createServer } from 'http';
import cors from 'cors'
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import profileRouter from './routes/profileRoute.js';
import postRouter from './routes/postRoute.js';
import commentRouter from './routes/commentRoute.js';
import followRouter from './routes/followRoute.js';
import likeUnlikeRouter from './routes/likeUnlikeRoute.js';
import exploreRouter from './routes/exploreRoute.js';
import searchRouter from './routes/searchRoute.js';
import { initSocket } from './socket.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// DB connection
connectDB();

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/profile', profileRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/follow', followRouter);
app.use('/api/like', likeUnlikeRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/search', searchRouter);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

initSocket(server)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});