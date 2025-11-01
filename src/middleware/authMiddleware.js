// import admin from 'firebase-admin';
// import User from '../models/User.js';
// import path from 'path';
// import fs from 'fs';

// // Load the service account key JSON file
// const serviceAccountPath = path.resolve('./serviceAccountKey.json');
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// // Initialize Firebase Admin
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // Middleware to protect routes
// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token found' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decodedToken = await admin.auth().verifyIdToken(token);

//     // Find or create the user in your database
//     let user = await User.findOne({ email: decodedToken.email });
//     if (!user) {
//       user = await User.create({
//         email: decodedToken.email,
//         name: decodedToken.name || decodedToken.email.split('@')[0],
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth error:', error);
//     res.status(401).json({ message: 'Not authorized' });
//   }
// };

import admin from '../config/firebaseAdmin.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token found' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find or create user in MongoDB
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      user = await User.create({
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};
