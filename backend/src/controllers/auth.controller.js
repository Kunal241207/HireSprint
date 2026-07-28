const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}

/**
 * @name registerUserController
 * @desc Register a user, expects username, email, and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        const hash = await bcrypt.hash(password, 10)

        const newUser = new userModel({ username, email, password: hash })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('token', token, cookieOptions)

        res.status(201).json({ message: 'User created successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email } })
    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @name loginUserController
 * @desc Login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('token', token, cookieOptions)

        res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @name logoutUserController
 * @desc Clears the token cookie and adds the token to the blacklist
 * @access Public
 */

async function logoutUserController(req, res) {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(400).json({ message: 'No token found' })
        }

        await tokenBlacklistModel.create({ token })

        res.clearCookie('token', cookieOptions)
        res.status(200).json({ message: 'Logout successful' })
    } catch (err) {
        console.error('Logout error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @name getMeController
 * @desc Get current logged in user details
 * @access Private
 */

async function getMeController(req, res) {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User details retrieved successfully', user: { id: user._id, name: user.name, email: user.email } })
    } catch (err) {
        console.error('GetMe error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }
