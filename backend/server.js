import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// ✅ CORS setup for frontend and admin panel
app.use(cors({
  origin: [
    'https://e-commerce-plum.vercel.app',  // frontend
    'https://e-commerce-2qst.vercel.app'   // admin
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Handle preflight requests
app.options('*', cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Default Route
app.get('/', (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(port, () => console.log('Server started on PORT : ' + port));
