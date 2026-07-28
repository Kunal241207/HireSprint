const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router()

/**
 * @route POST /api/interview
 * @description Generate an interview report based on candidate information
 * @access private
 */
interviewRouter.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get an interview report by ID
 * @access private
 */
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description Get all interview reports for the authenticated user
 * @access private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate a resume PDF based on an interview report
 * @access private
 */
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRouter