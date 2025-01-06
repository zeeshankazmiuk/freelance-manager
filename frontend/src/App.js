import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch job data from the API
    fetch('http://localhost:3001/api/jobs')
      .then(response => response.json())
      .then(data => {
        setJobs(data); // Set the job data to state
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(err => {
        setError('Failed to fetch jobs');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Listings</h1>
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
                <p>Budget: ${job.budget}</p>
                <p>Skills: {job.skills}</p>
                <p>Client Rating: {job.client_rating}</p>
                <p>Posted Date: {job.posted_date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs available</p>
        )}
      </header>
    </div>
  );
}

export default App;
