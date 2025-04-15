import React, { useState } from 'react';
import './FindJobsPage.css';
import { fetchScrapedJobs } from '../services/apiService';
import { claimJob } from '../services/apiService';


const FindJobsPage = ({ user }) => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchScrapedJobs(query);
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimJob = async (job) => {
    const confirmed = window.confirm("Are you sure you want to claim this job?");
    if (!confirmed) return;
  
    try {
      await claimJob(job.title, job.description, user.username);  // include username
      alert("Job successfully claimed!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while claiming the job.");
    }
  };  
  

  return (
    <div className="content-inner w-full mx-auto max-w-4xl px-4">
        <h2 className="text-xl font-bold mb-4">Find Freelance Jobs</h2>
  
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
  
        {loading && <p>Loading jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        <ul className="space-y-4 p-0 list-none">
          {jobs.map((job, index) => (
            <li
              key={index}
              onDoubleClick={() => handleClaimJob(job)}
              className="bg-white border rounded p-4 shadow whitespace-pre-wrap break-words"
            >
              <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
              <p className="mb-2">{job.description}</p>
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Upwork
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
  ); 
}; 

export default FindJobsPage;
