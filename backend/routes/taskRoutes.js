const express = require('express')
const { createTask, getTasks, updateTask, deleteTask, getTaskStats, getTask } = require('../controllers/taskController')
const authenticate = require('../middlewares/authenticate')
const taskRouter = express.Router()

taskRouter.use(authenticate)
taskRouter.post('/', createTask)
taskRouter.get('/', getTasks)
taskRouter.get('/stats', getTaskStats)
taskRouter.get('/:id', getTask)
taskRouter.put('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

module.exports = taskRouter

