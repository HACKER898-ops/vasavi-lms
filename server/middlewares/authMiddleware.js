import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token and attach userId to request
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Invalid or expired token' });
    }
};

// Middleware (protect educator route)

export const protectEducator = async(req,res, next) => {
    try {
        const userId = req.userId

        if (!userId) {
            return res.json({ success: false, message: 'Authentication required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Allow all authenticated users to access educator features
        // You can add role checking here if needed
        next()

    } catch (error) {
        return res.json({success: false, message:error.message})
    }
}