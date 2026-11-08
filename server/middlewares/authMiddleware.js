import { getAuth } from '@clerk/express';
import User from '../models/User.js';

// Verify the Clerk session and attach userId (the Clerk user id) to the request
export const verifyToken = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.json({ success: false, message: 'No token provided' });
        }

        req.userId = userId;
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Invalid or expired token' });
    }
};

// Middleware (protect educator route)
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({ success: false, message: 'Authentication required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Same as before: all authenticated users can access educator features.
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Aliases used by the new server.js
export const requireAuthUser = verifyToken;
export const requireEducator = protectEducator;