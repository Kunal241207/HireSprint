import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Code2, MessageSquare, Send, ChevronDown, ChevronUp, Astroid } from 'lucide-react'
import '../styles/interview.scss'
import { useInterview } from '../hooks/useInterview'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical') // 'technical' | 'behavioral' | 'roadmap'
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const { interviewId } = useParams()
  const { report, getReportById, loading, getResumePdf } = useInterview()
  
  useEffect(() => {
    if (!report || report._id !== interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  if (loading || !report) {
    return (
      <main className="interview">
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'white', fontSize: '1.2rem' }}>Getting your interview report...</div>
      </main>
    )
  }

  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behaviouralQuestions || [];
  const roadMap = report?.preparationPlan || [];
  const skillGaps = report?.skillGaps || [];
  const matchScore = report?.overallScore || 0;

  const renderContent = () => {
    let questions = [];
    let title = "";
    
    if (activeTab === 'technical') {
      questions = technicalQuestions;
      title = "Technical Questions";
    } else if (activeTab === 'behavioral') {
      questions = behavioralQuestions;
      title = "Behavioral Questions";
    } else if (activeTab === 'roadmap') {
      // Roadmap has a different structure, handled separately if needed, but for now we focus on the questions layout
      title = "Preparation Road Map";
    }

    return (
      <div className="tab-section">
        <div className="section-header">
          <h3>{title}</h3>
          {activeTab !== 'roadmap' && (
            <span className="count-badge">{questions.length} questions</span>
          )}
        </div>
        
        {activeTab !== 'roadmap' ? (
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`question-card ${expandedQuestion === `${activeTab}-${idx}` ? 'expanded' : ''}`}
                onClick={() => setExpandedQuestion(expandedQuestion === `${activeTab}-${idx}` ? null : `${activeTab}-${idx}`)}
              >
                <div className="card-header">
                  <div className="question-title-wrapper">
                    <span className="q-badge">Q{idx + 1}</span>
                    <h4>{q.question}</h4>
                  </div>
                  {expandedQuestion === `${activeTab}-${idx}` ? (
                    <ChevronUp size={18} className="chevron-icon" />
                  ) : (
                    <ChevronDown size={18} className="chevron-icon" />
                  )}
                </div>
                {expandedQuestion === `${activeTab}-${idx}` && (
                  <div className="card-body">
                    <div className="intention">
                      <strong>Intention:</strong> {q.intention}
                    </div>
                    <div className="answer">
                      <strong>Suggested Answer:</strong> {q.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="roadmap-timeline">
            {roadMap.map((item) => (
              <div key={item.day} className="timeline-item">
                <div className="day-badge">Day {item.day}</div>
                <div className="timeline-content">
                  <h4>{item.focus}</h4>
                  <ul>
                    {item.tasks.map((task, index) => (
                      <li key={index}>
                        <span className="dot"></span> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="interview">
      <div className="interview-container">
        
        {/* Left Column: Navigation / Categories */}
        <div className="left-panel">
          <div className="panel-title">SECTIONS</div>
          <div className="nav-group">
            <button
              className={`nav-btn ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <Code2 size={18} />
              <span>Technical Questions</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
              onClick={() => setActiveTab('behavioral')}
            >
              <MessageSquare size={18} />
              <span>Behavioral Questions</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <Send size={18} />
              <span>Road Map</span>
            </button>
          </div>
          <button onClick={() => getResumePdf(interviewId)} className='btn primary-btn' style={{fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem"}}>
            <Astroid size={16}/>
            Download Resume</button>
        </div>

        {/* Center Column: Main Content Area */}
        <div className="center-panel">
          <div className="content-details">
            {renderContent()}
          </div>
        </div>

        {/* Right Column: Skill Gaps */}
        <div className="right-panel">
          <div className={`match-score-section ${matchScore >= 80 ? 'theme-green' : matchScore >= 50 ? 'theme-orange' : 'theme-red'}`}>
            <div className="panel-title">MATCH SCORE</div>
            <div className="score-circle">
              <svg viewBox="0 0 36 36" className="circular-chart theme">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  style={{ strokeDasharray: `${matchScore}, 100` }}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{matchScore}%</text>
              </svg>
            </div>
            <p className="match-text">
              {matchScore >= 80 ? 'Strong match for this role' : matchScore >= 50 ? 'Moderate match for this role' : 'Low match for this role'}
            </p>
          </div>

          <div className="skill-gaps-section">
            <div className="panel-title">SKILL GAPS</div>
            <div className="tags-container">
              {skillGaps.map((skill, index) => (
                <div key={index} className={`skill-card severity-${skill.severity}`}>
                  {skill.skill}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Interview