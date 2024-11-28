const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDb = require('./DB/db')
const authRouter = require('./routes/authRoutes')
const taskRouter = require('./routes/taskRoutes')
const bodyParser = require('body-parser')
dotenv.config()


const app = express()

app.use(cors())
app.use(bodyParser.json())

connectDb()

app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
