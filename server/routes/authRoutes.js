import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', verifyToken, getCurrentUser);

export default authRouter;
