const {GoogleGenAI} = require("@google/genai")
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        overallScore: { 
            type: "INTEGER", 
            description: "A holistic and precise score from 0-100 evaluating the candidate's overall fit for the role." 
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "A tailored list of technical questions likely to be asked. (atleast 5 questions)",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "A sharp, role-specific technical question matching the candidate's stack to the job description." },
                    intention: { type: "STRING", description: "The core concept, coding practice, or system design trade-off the interviewer is checking for." },
                    answer: { type: "STRING", description: "A direct, structured blueprint answer. Highlight exact key-terms to mention and common pitfalls/phrases to avoid." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behaviouralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions matching the candidate's career stage. (atleast 4 questions)",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "A situational question targeting leadership, collaboration, or conflict resolution." },
                    intention: { type: "STRING", description: "The underlying cultural fit or behavioral trait the interviewer is looking to extract." },
                    answer: { type: "STRING", description: "A targeted response blueprint structured strictly around the STAR method using the candidate's background." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "Key missing qualifications alongside their priority level.",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The specific tool, framework, concept or skill required by the job that the candidate is lacking." },
                    severity: { type: "STRING", enum: ["low", "medium", "high"], description: "How critical this missing skill is." }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A structured daily countdown plan to prepare the candidate.",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "The day number of the study roadmap." },
                    focus: { type: "STRING", description: "The singular subject area for the day (e.g.,'Data Structures', 'React Architecture', 'System Design: Scale')." },
                    tasks: { type: "ARRAY", items: { type: "STRING" }, description: "A list of tasks to complete on this day." }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: {
            type: "STRING",
            description: "The title of the job for which the interview report is generated."
        }
    },
    required: ["overallScore", "technicalQuestions", "behaviouralQuestions", "skillGaps", "preparationPlan", "title"]
}

async function generateInterviewReport({resumeText, selfDescription, jobDescription}){
    const prompt = `You are an expert technical interviewer and career coach. 
                    Analyze the provided details to generate a highly tailored, custom interview preparation report.
                    
                    Resume Text: ${resumeText}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`;

    const res = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
            temperature: 0.2
        }
    })

    return (JSON.parse(res.text))
} 

async function pdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({ format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '13mm', right: '13mm' } })
    await browser.close()
    return pdf
}

async function generatePdf({resumeText, selfDescription, jobDescription}) {
    const resumePdfSchema = {
        type: "OBJECT",
        properties: {
            Html: {
                type: "STRING",
                description: "The complete, fully styled HTML content of the resume which will be converted to PDF using library like puppeteer."
            }
        },
        required: ["Html"]
    }

    const prompt = `Generate an optimised resume for the candidate from the following HTML content: 
                    Resume Text: ${resumeText}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
                    
                    The response should be a JSON object with a single field "Html" which contains the HTML content of the generated resume that can be converted to PDF using puppeteer.
                    The resume should be professionally styled and include all relevant information. The HTML content should be well-structured and visually appealing. 
                    The content of the resume should not feel repetitive or generic or like its generated by AI and should be close as possible to a professionally human-crafted resume.
                    The content should be ATS-friendly, i.e. its should be easily parseable by applicant tracking systems without losing important information.
                    The resume should not be overly long or contain unnecessary information, it should be ideally 1 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all relevant information that can increase the candidate's chances of getting an interview.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
            temperature: 0.1
        }
    })

    const jsonContent = (JSON.parse(response.text))

    const pdfBuffer = await pdfFromHtml(jsonContent.Html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generatePdf }
