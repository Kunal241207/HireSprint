import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

const generateInterviewReport = async (resumeFile, selfDescription, jobDescription, title) => {
  const formData = new FormData();
  if (resumeFile) formData.append('resume', resumeFile);
  if (selfDescription) formData.append('selfDescription', selfDescription);
  if (jobDescription) formData.append('jobDescription', jobDescription);
  if (title) formData.append('title', title);

  const response = await api.post('/api/interview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data;
}

const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
}

const getAllInterviewReports = async () => {
  const response = await api.get('/api/interview');
  return response.data;
}

const generateResumePdf = async (interviewReportId) => {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, { responseType: 'blob' });
  return response.data;
}

export { generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf };