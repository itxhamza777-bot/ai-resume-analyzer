import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      alert("Please upload a CV and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://ai-resume-analyzer-production-4651.up.railway.app/match-job/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 AI Resume Analyzer</h1>
        <p style={styles.subtitle}>
          Match your CV with any job description instantly
        </p>

        {/* File Upload */}
        <label style={styles.label}>Upload Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        {/* Job Description */}
        <label style={styles.label}>Job Description</label>
        <textarea
          rows="5"
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={styles.textarea}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file || !jobDesc}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div style={styles.resultCard}>
            <h3>Match Score</h3>

            <div style={styles.progressWrapper}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${result.match_score || 0}%`,
                }}
              />
            </div>

            <p style={styles.scoreText}>
              {result.match_score || 0}%
            </p>

            <div style={styles.grid}>
              <div>
                <h4>✅ Skills Found</h4>
                <ul>
                  {(result.skills || []).map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4>💡 Suggestions</h4>
                <ul>
                  {(result.suggestions || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "520px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#666",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    resize: "none",
  },
  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resultCard: {
    marginTop: "25px",
    padding: "20px",
    background: "#f9fafc",
    borderRadius: "10px",
  },
  progressWrapper: {
    width: "100%",
    height: "10px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "10px",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
  },
  scoreText: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
};

export default App;
