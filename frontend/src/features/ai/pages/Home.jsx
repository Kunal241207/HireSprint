import { BriefcaseBusiness, CloudUpload, Info, Sparkles, UserRound, Calendar, ArrowRight } from 'lucide-react'
import Hero from './Hero'
import '../styles/home.scss'
import { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

function Home() {
  const {loading, generateReport, reports, getReports} = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const resumeInputRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    getReports()
  }, [])

  const handleGenerateReport = async() => {
    const data = await generateReport({jobDescription, selfDescription, resumeFile: resumeInputRef.current.files[0]})
    if (data && data._id) {
      navigate(`/interview/${data._id}`)
    }
  }

  if (loading){
    return <main>Loading your interview plan...</main>
  }

  return (
    <div className="home">
      <Hero/>
      <main>
        <div className="container">

          <div className="left">
            <div className="section-heading">
              <label className="section-title" htmlFor="jobDescription">
                <BriefcaseBusiness size={24} />
                Target Job Description
              </label>

              <span className="badge">Required</span>
            </div>

            <textarea
              id="jobDescription"
              placeholder="Paste the target job description here to analyze alignment..."
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="right">

            <h2 className="section-title">
              <UserRound size={24} />
              Your Profile
            </h2>

            <div className="upload-heading">
              <span>Upload Resume</span>
            </div>

            <label className="file-label" htmlFor="resume">
              <CloudUpload size={42} />
              <strong>Click to upload or drag & drop</strong>
              <small>PDF (Max 4MB)</small>
            </label>

            <input
              ref={resumeInputRef}
              hidden
              id="resume"
              type="file"
              accept=".pdf,.docx"
            />

            <div className="divider">
              <span>OR</span>
            </div>

            <label className="section-title self-title">
              Quick Self-Description
            </label>

            <textarea
              className="self-textarea"
              placeholder="Briefly describe your experience, key skills, and years of experience..."
              onChange={(e) => setSelfDescription(e.target.value)}
            />

            <small className="notice">
              <Info size={16} />
              Tip: Upload both your resume and a self-description for the best
              results.
            </small>

          </div>

          <div className="form-footer">
            <button
              onClick={handleGenerateReport}
              className="btn primary-btn generate-btn"
            >
              <Sparkles size={18} />
              Generate My Interview Strategy
            </button>
          </div>

        </div>

        {reports.length > 0 && (
          <section className="recent-reports">

            <div className="reports-header">
              <h2>Previous Reports</h2>
              <span>{reports.length} Report{reports.length > 1 && "s"}</span>
            </div>

            <div className="reports-grid">

              {reports.map((report) => (
                <div
                  key={report._id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >

                  <h3>{report.title || "Untitled Report"}</h3>

                  <div className="report-bottom">

                    <div className="date">
                      <Calendar size={15} />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>

                    <ArrowRight size={18} />

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}
      </main>
    </div>
  )
}

export default Home
