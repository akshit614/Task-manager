const { TaskModel } = require("../models/schemas")

exports.createTask = async (req, res) => {
  try {
    const task = new TaskModel(
        { ...req.body, 
            userId: req.user.id 
        })
    task.totalTime = (new Date(task.endTime) - new Date(task.startTime)) / (1000 * 60 * 60)
    await task.save()
    res.status(201).json({
      msg : "Task created successfully" , 
      task
    })
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.user.id })
    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateTask = async (req, res) => {
  try {
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!task) return res.status(404).json({ message: "Task not found" })
    res.status(200).json({
      msg : "task updated!", 
      task
    })
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })
    if (!task) return res.status(404).json({ message: "Task not found" })
    res.status(200).json({ message: "Task deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


exports.getTaskStats = async (req, res) => {
  try {
      const tasks = await TaskModel.find({ userId: req.user.id })

      const totalCount = tasks.length

      const completedTasks = tasks.filter(task => task.status === 'finished')
      const pendingTasks = tasks.filter(task => task.status === 'pending')

      const percentCompleted = totalCount ? (completedTasks.length / totalCount) * 100 : 0
      const percentPending = totalCount ? (pendingTasks.length / totalCount) * 100 : 0

      // Calculate total time taken for completed tasks
      const totalCompletedTime = completedTasks.reduce((sum, task) => {
          return sum + (new Date(task.endTime) - new Date(task.startTime)) / (1000 * 60 * 60) // in hours
      }, 0)
      const averageCompletionTime = completedTasks.length
          ? totalCompletedTime / completedTasks.length
          : 0

      // Calculate time lapsed and balance estimated time for pending tasks
      const currentTime = new Date()
      const timeStats = pendingTasks.reduce(
          (stats, task) => {
              const timeLapsed = (currentTime - new Date(task.startTime)) / (1000 * 60 * 60) // in hours
              const estimatedRemainingTime = Math.max(
                  (new Date(task.endTime) - currentTime) / (1000 * 60 * 60),
                  0
              ) // ensure no negative time

              stats.totalLapsedTime += timeLapsed
              stats.totalBalanceTime += estimatedRemainingTime
              stats.priorityBreakdown[task.priority] = stats.priorityBreakdown[task.priority] || {
                  lapsed: 0,
                  remaining: 0,
              }

              stats.priorityBreakdown[task.priority].lapsed += timeLapsed
              stats.priorityBreakdown[task.priority].remaining += estimatedRemainingTime

              return stats
          },
          { totalLapsedTime: 0, totalBalanceTime: 0, priorityBreakdown: {} }
      )

      const response = {
          totalCount,
          pendingTasks : pendingTasks.length,
          percentCompleted,
          totalCompletedTime,
          percentPending,
          averageCompletionTime,
          totalLapsedTime: timeStats.totalLapsedTime,
          totalBalanceTime: timeStats.totalBalanceTime,
          priorityBreakdown: timeStats.priorityBreakdown, // Per-priority breakdown of lapsed and remaining time
      }

      res.status(200).json(response)
  } catch (err) {
      res.status(500).json({ error: err.message })
  }
}

