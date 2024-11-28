const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/schemas')
const {z} = require("zod")

const registerInputs = z.object({
    email : z.string().email().min(1, "Email can not be empty"),
    password : z.string().min(8, "Password must be of 8 letters"),
    name : z.string().min(1, "Name cannot be empty")
})

exports.reigster = async (req, res) => {

    const {success} = registerInputs.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg : "Register inputs formats are incorrect"
        })
    } 

    try {
        const { email, password, name } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ email, password: hashedPassword, name })
        await newUser.save()
        res.status(201).json({ 
            message: 'User registered successfully!' , 
            newUser 
        })

    } catch (err) {
        res.status(500).json({ 
            error: err.message, 
            msg : "error in registering user"
        })
    }
}

const loginInputs = z.object({
    email : z.string().email().min(1, "Email can not be empty"),
    password : z.string().min(8, "Password must be of 8 letters")
})

exports.login = async (req, res) => {

    const {success} = loginInputs.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg : "login input formats incorrect"
        })
    } 
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' })
        res.status(200).json({ 
            msg: "Login Successfully" ,
            token, 
            user 
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
