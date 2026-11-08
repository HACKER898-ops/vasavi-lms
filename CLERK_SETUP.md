# Clerk + MongoDB User Sync

## How It Works

Your app now **automatically syncs Clerk users to MongoDB** without needing webhooks!

### What Happens When a User Logs In:

1. **User logs in with Google** (or any Clerk authentication method)
2. **Clerk handles authentication** and creates a session
3. **On first API request**, the `syncUserMiddleware` runs:
   - Checks if user exists in MongoDB
   - If not found, fetches user details from Clerk
   - Creates user record in MongoDB with:
     - `_id`: Clerk user ID
     - `email`: Primary email
     - `name`: First + Last name
     - `imageUrl`: Profile picture
     - `enrolledCourses`: Empty array (ready for course enrollments)
4. **User is now in your database** and ready to use all features!

## Setup Instructions

### 1. Enable Google OAuth in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **User & Authentication** → **Social Connections**
4. Enable **Google** (or any OAuth provider you want)
5. Save changes

### 2. Configure Environment Variables

**Client (.env):**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_CURRENCY=₹
```

**Server (.env):**
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Other configs...
```

### 3. Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
2. Copy **Publishable Key** → Add to both client and server `.env`
3. Copy **Secret Key** → Add to server `.env` only

### 4. Test the Integration

1. **Start the server:**
   ```powershell
   cd server
   node server.js
   ```

2. **Start the client:**
   ```powershell
   cd client
   npm run dev
   ```

3. **Log in with Google:**
   - Click Sign In
   - Choose Google authentication
   - First time logging in? User is automatically created in MongoDB!

4. **Check users in database:**
   ```powershell
   cd server
   node checkUsers.js
   ```

## Advantages Over Webhooks

✅ **No tunnel needed** for local development (ngrok, etc.)
✅ **Simpler setup** - no webhook configuration required
✅ **Immediate sync** - happens on first API call
✅ **Automatic** - works for all auth methods (Google, Email, etc.)
✅ **Reliable** - no missed webhook events

## How to Verify It's Working

1. Log in to your app with a new Google account
2. Check server console - you'll see:
   ```
   🔄 New user detected, syncing with database...
   ✅ User synced to database: user@gmail.com
   ```
3. User is now in MongoDB and can enroll in courses!

## Existing Seeded Users

The database already contains 8 seeded users for testing:
- 3 educators
- 5 students

New users logging in with Clerk will be added automatically!

## Need Help?

- Check server console for sync messages
- Run `node checkUsers.js` to see all users in database
- Ensure Clerk keys are correctly configured in `.env` files
