const mongoose = require('mongoose')

/**
 * - job description: String
 * - resume text: String
 * - self description: String
 * 
 * -- Overall score: Number
 * 
 * - Technical questions: [{
 *                          question: String,
 *                          intention: String,
 *                          answer: String
 *                        }]
 * - Behavioural questions: [{
 *                            question: String,
 *                            intention: String,
 *                            answer: String
 *                          }]
 * - Skill gaps: [{
 *                 skill: String,
 *                 severity: {type: String, enum: ['low', 'medium', 'high']},
 *               }]
 * - Preparation Plan: [{
 *                       day: Number,
 *                       focus: String,
 *                       tasks: [String]
 *                     }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    intention: {type: String, required: true},
    answer: {type: String, required: true}
},{
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    intention: {type: String, required: true},
    answer: {type: String, required: true}
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {type: String, required: true},
    severity: {type: String, enum: ['low', 'medium', 'high'], required: true}
},{
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {type: Number, required: true},
    focus: {type: String, required: true},
    tasks: [{type: String, required: true}]
},{
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    },
    resumeText: {
        type: String, 
    },
    selfDescription: {
        type: String, 
    },
    overallScore: {
        type: Number, 
        min: 0,
        max: 100,
        required: true
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    }
    },
    {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel