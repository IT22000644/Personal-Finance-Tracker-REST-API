import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'
import './src/cron/jobs.js'

import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import logger from './src/utils/logger.js'
import morganMiddlware from './src/middleware/morgan.middleware.js'
import connect from './src/db/db.js'
import handleErrors from './src/middleware/error.middlware.js'
import userRouter from './src/routes/user.route.js'
import categoryRouter from './src/routes/category.route.js'
import transactionRouter from './src/routes/transaction.route.js'
import goalRouter from './src/routes/goal.route.js'
import budgetRouter from './src/routes/budget.route.js'
import reportRouter from './src/routes/report.route.js'

const PORT = process.env.NODE_DOCKER_PORT

const app = express()

app.use(cookieParser())

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Restricts everything by default to the same origin
            frameAncestors: ["'none'"], // Prevents the site from being embedded in iframes
            formAction: ["'self'"], // Restricts form submissions to the same origin
        },
    })
)

// attach middlware
app.use(
    cors({
        origin: 'http://random.com',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'FETCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)
app.use(express.json({ limit: '50mb' }))

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello there!' })
})

app.use('/api/v1', userRouter)
app.use('/api/v1', categoryRouter)
app.use('/api/v1', transactionRouter)
app.use('/api/v1', goalRouter)
app.use('/api/v1', budgetRouter)
app.use('/api/v1', reportRouter)

app.use(morganMiddlware)
app.use(handleErrors)

const server = app.listen(PORT, () => {
    logger.info(`Server is Running on ${PORT}`)
    connect()
})

export { app, server }
