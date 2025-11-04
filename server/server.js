// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/connectDB.js';
import connectCloudinary from './configs/cloudinary.js';

// ⬇ Import routes & controllers
import authRouter from './routes/authRoutes.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

const startServer = async () => {
  try {
    // ✅ Connect MongoDB
    await connectDB();

    // ✅ Connect Cloudinary
    connectCloudinary();
    console.log('✅ Database & Cloudinary connected successfully');

    // ✅ Enable CORS for all local dev ports & production URL
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5180', // ✅ Add your current frontend port here
    ];

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (e.g. mobile apps, curl)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(new Error('CORS not allowed for this origin'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    // ✅ Handle preflight requests
    app.options('*', cors());

    /* ===================================================
       ⚡ Stripe Webhook (raw body required)
       =================================================== */
    app.post(
      '/api/webhooks/stripe',
      express.raw({ type: 'application/json' }),
      stripeWebhooks
    );

    /* ===================================================
       ✅ JSON Parsing for all other routes
       =================================================== */
    app.use(express.json());

    /* ===================================================
       🚀 API Routes
       =================================================== */
    app.get('/', (req, res) => res.send('✅ API Working'));

    app.use('/api/auth', authRouter);
    app.use('/api/educator', educatorRouter);
    app.use('/api/course', courseRouter);
    app.use('/api/user', userRouter);
    app.use('/api/admin', adminRouter);

    /* ===================================================
       🌐 Start Server
       =================================================== */
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `🚀 Server running at ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`
      );
    });
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  }
};

// ✅ Start the app
startServer();
