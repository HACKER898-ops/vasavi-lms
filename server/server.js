import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import connectDB from './configs/mongodb.js'
import connectCloudinay from './configs/cloudinary.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import { requireAuthUser, requireEducator } from './middlewares/authMiddleware.js'

// initialize express
const app = express()

// connect to db and cloudinary
await connectDB()
await connectCloudinay()

// middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(clerkMiddleware())

// Webhooks: these need the raw body, so they must come BEFORE express.json()
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Routes
app.get('/', (req, res) => { res.send('Vasavi API is working fine!') })
app.use('/api/educator', express.json(), requireAuthUser, requireEducator, educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), requireAuthUser, userRouter)

// Vercel needs the app exported; app.listen only runs locally
export default app

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
  })
}