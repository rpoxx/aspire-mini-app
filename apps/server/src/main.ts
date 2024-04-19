import express, { Application } from 'express'
import { LOCAL_PORT } from './config/app.config'
import { createDbConnection } from './database/database.service'
import userRoutes from './routes/user.routes'
import loanRoutes from './routes/loan.routes'
import repaymentRoutes from './routes/repayment.routes'
import authRoutes from './routes/auth.routes'

async function startApp() {
  const app: Application = express()
  app.use(express.json()) // Parse JSON requests

  // Config
  const PORT = process.env.PORT ?? LOCAL_PORT

  // --- Database Module ---
  // We don't want the app to start if the connection fails
  await createDbConnection(app)

  // --- Routes Module ---
  app.use('/api/auth', authRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/loan', loanRoutes)
  app.use('/api/repayment', repaymentRoutes)

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
  })
}

startApp()
