import {generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf} from '../services/interview.api.js';
import { useContext } from 'react';
import { InterviewContext } from '../interview.context.jsx';

export function useInterview() {
  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context

  const generateReport = async ({jobDescription, selfDescription, resumeFile}) => {
    setLoading(true)
    let res = null
    try{
      res = await generateInterviewReport(resumeFile, selfDescription, jobDescription)
      setReport(res.interviewReport)
    } catch (error) {
      console.error('Error generating interview report:', error)
    } finally {
      setLoading(false)
    }
    return res?.interviewReport
  }

  const getReportById = async (interviewId) => {
    setLoading(true)
    let res = null
    try{
      res = await getInterviewReportById(interviewId)
      setReport(res.interviewReport)
    } catch (error) {
      console.error('Error fetching interview report:', error)
    } finally {
      setLoading(false)
    }
    return res?.interviewReport
  }

  const getReports = async() => {
    setLoading(true)
    let res = null
    try{
      res = await getAllInterviewReports()
      setReports(res.interviewReports)
    } catch (error) {
      console.error('Error fetching interview reports:', error)
    } finally {
      setLoading(false)
    }
    return res?.interviewReports
  }

  const getResumePdf = async (interviewReportId) => {
    setLoading(true)
    let res = null
    try{
      res = await generateResumePdf(interviewReportId)
      const url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error generating resume PDF:', error)
    } finally {
      setLoading(false)
    }
    return res
  }

  return {loading, report, reports, generateReport, getReportById, getReports, getResumePdf}
}