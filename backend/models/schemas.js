const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },
    name : {type : String, required :true},
    password: { type: String, required: true }, 
})


const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true , default : Date.now()},
    endTime: { type: Date },
    priority: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, enum: ['pending', 'finished'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

taskSchema.index({ timestamp: 1 })

const UserModel = new mongoose.model('User', userSchema)
const TaskModel = new mongoose.model('Task', taskSchema)

module.exports = {UserModel,TaskModel} 

