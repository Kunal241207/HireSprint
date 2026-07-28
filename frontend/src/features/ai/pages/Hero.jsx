import '../styles/hero.scss'

const Hero = () => {
  return (
    <section className="hero">
      <div className="content">
        <div className="text">
          <h1>
            Build Resumes That Get
            <br />
            <span>Interviews</span>
          </h1>

          <p>
            Analyse your resume against any job description, receive a detailed AI report with actionable insights, and generate an ATS-optimised resume tailored to the job description.
          </p>
        </div>

        <div className="card">
          <div className="status">
            <span className="dot"></span>
            <span>Live Analysis</span>
          </div>

          <div className="bar short"></div>
          <div className="bar"></div>
          <div className="bar half"></div>

          <h2>98.4%</h2>
          <small>Match Score</small>
        </div>
      </div>
    </section>
  )
}

export default Hero