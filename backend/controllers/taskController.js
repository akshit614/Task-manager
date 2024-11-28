const { TaskModel } = require("../models/schemas")

exports.createTask = async (req, res) => {
  try {
    const task = new TaskModel(
        { ...req.body, 
            userId: req.user.id 
        })
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
