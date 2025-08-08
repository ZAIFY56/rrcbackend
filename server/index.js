import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// Middleware - simplified for initial deployment
app.use(cors({
  origin: '*', // Temporarily open for testing
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    endpoints: {
      health: '/api/health',
      payment: '/api/payments/create-checkout-session'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Vercel requires this export
export default app;
