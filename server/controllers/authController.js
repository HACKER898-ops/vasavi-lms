import jwt from 'jsonwebtoken';
import Auth from '../models/Auth.js';
import User from '../models/User.js';
import { randomBytes } from 'crypto';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Generate unique ID
const generateUniqueId = () => {
    return 'user_' + randomBytes(12).toString('hex');
};

// Register new user
export const register = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        // Validate input
        if (!username || !email || !password || !name) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        // Check if username or email already exists
        const existingAuth = await Auth.findOne({
            $or: [{ username }, { email }]
        });

        if (existingAuth) {
            return res.json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        // Generate unique user ID
        const userId = generateUniqueId();

        // Create user in User collection
        const user = await User.create({
            _id: userId,
            name,
            email,
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            enrolledCourses: []
        });

        // Create auth credentials
        const auth = await Auth.create({
            username,
            email,
            password,
            userId: user._id
        });

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Find auth record
        const auth = await Auth.findOne({ username });

        if (!auth) {
            return res.json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        // Check password
        const isMatch = await auth.comparePassword(password);

        if (!isMatch) {
            return res.json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

        // Get user data
        const user = await User.findById(auth.userId);

        if (!user) {
            return res.json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl,
                enrolledCourses: user.enrolledCourses
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Logout (client-side will remove token)
export const logout = async (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
};
