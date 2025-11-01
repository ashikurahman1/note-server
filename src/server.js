import dotenv from 'dotenv';
dotenv.config();

console.log('ENV FILE LOADED ✅');
console.log(
  'FIREBASE_SERVICE_ACCOUNT_KEY length:',
  process.env.FIREBASE_PRIVATE_KEY?.length
);

import express from 'express';
import path from 'path'; //for production;
import cors from 'cors';

import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve(); //For production

//middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

app.use('/api/notes', notesRoutes);

// For Productions only
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// For Productions only end

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server running successfully in port', PORT);
  });
});
