import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

/**
 * Middleware to sync Clerk user with MongoDB
 * Automatically creates user in DB if they don't exist
 */
export const syncUserWithDB = async (req, res, next) => {
    try {
        // Check if user is authenticated via Clerk
        if (!req.auth || !req.auth.userId) {
            return next();
        }

        const userId = req.auth.userId;

        // Check if user exists in our database
        let user = await User.findById(userId);

        if (!user) {
            // User doesn't exist in DB, fetch from Clerk and create
            console.log('🔄 New user detected, syncing with database...');
            
            const clerkUser = await clerkClient.users.getUser(userId);
            
            const userData = {
                _id: clerkUser.id,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
                name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                imageUrl: clerkUser.imageUrl || "",
                enrolledCourses: []
            };

            user = await User.create(userData);
            console.log('✅ User synced to database:', user.email);
        }

        // Attach user to request for convenience
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Error syncing user:', error);
        next(); // Continue even if sync fails
    }
};
