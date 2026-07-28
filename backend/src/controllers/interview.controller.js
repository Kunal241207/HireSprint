const pdfParse = require('pdf-parse')
const {generateInterviewReport, generatePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

/**
 * @description Generate an interview report based on candidate information
 */

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body
        
        if (!jobDescription) {
            return res.status(400).json({ message: 'Target Job Description is required.' })
        }

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: 'Please provide either a Resume PDF or a Quick Self-Description.'
            })
        }

        let resumeText = ""

        if (req.file) {
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

            resumeText = parsed.text

            if (!resumeText || resumeText.trim().length === 0) {
                return res.status(400).json({
                    message: "Could not extract text from the uploaded PDF."
                })
            }
        }

        const interviewReportByAI = await generateInterviewReport({
            resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        })

        return res.status(201).json({
            message: 'Interview report generated successfully',
            interviewReport
        })
    } catch (err) {
        console.error('Interview report error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @description Get an interview report by interviewId
 */

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' })
        }

        return res.status(200).json({
            message: 'Interview report retrieved successfully',
            interviewReport
        })
    } catch (err) {
        console.error('Get interview report error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @description Get all interview reports for the authenticated user
 */

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select('-resumeText -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan') 

        return res.status(200).json({
            message: 'Interview reports retrieved successfully',
            interviewReports
        })
    } catch (err) {
        console.error('Get all interview reports error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * @description Controller to generate resume Pdf based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res){
    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' })
    }

    const {resumeText, selfDescription, jobDescription} = interviewReport

    const pdfBuffer = await generatePdf({ resumeText, selfDescription, jobDescription })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"')
    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
