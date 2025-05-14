import React, { useState } from 'react';
import './FindJobsPage.css';
import { fetchScrapedJobs } from '../services/apiService';
import { claimJob } from '../services/apiService';
import { Search } from 'lucide-react';


const FindJobsPage = ({ user }) => {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    experience: '',
    pay: '',
    duration: ''
  });

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
  
  const filteredJobs = jobs.filter(job => {
    const matchesExperience = !filters.experience || job.experienceLevel?.toLowerCase().includes(filters.experience.toLowerCase());
    const matchesPay = !filters.pay || job.pay?.toLowerCase().includes(filters.pay.toLowerCase());
  
    const monthsRegex = /(\d+)\s*month/i;
    const durationMatch = job.duration?.match(monthsRegex);
    const jobMonths = durationMatch ? parseInt(durationMatch[1]) : null;
  
    const matchesDuration =
      !filters.duration ||
      (filters.duration === '>6' && jobMonths > 6) ||
      (jobMonths !== null && jobMonths <= parseInt(filters.duration));
  
    return matchesExperience && matchesPay && matchesDuration;
  });
  

  return (
    <div className="content-inner w-full mx-auto max-w-4xl px-4">
      <div className="find-jobs-header">
        
  
      <div className="search-bar">
  <input
    type="text"
    placeholder="Search jobs..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button onClick={handleSearch} className="search-icon-btn" aria-label="Search">
    <Search size={18} />
  </button>
</div>

      </div>
  
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}
  
      {/* Filter UI */}
      <div className="filters-container">
  <div className="filter-group">
    <label>Experience</label>
    <select
      value={filters.experience}
      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
    >
      <option value="">All</option>
      <option value="Entry Level">Entry Level</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Expert">Expert</option>
    </select>
  </div>

  <div className="filter-group">
    <label>Pay Type</label>
    <select
      value={filters.pay}
      onChange={(e) => setFilters(prev => ({ ...prev, pay: e.target.value }))}
    >
      <option value="">All</option>
      <option value="Hourly">Hourly</option>
      <option value="Fixed-Price">Fixed-Price</option>
    </select>
  </div>

  <div className="filter-group">
    <label>Duration</label>
    <select
      value={filters.duration}
      onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
    >
      <option value="">All</option>
      <option value="1">≤ 1 month</option>
      <option value="2">≤ 2 months</option>
      <option value="3">≤ 3 months</option>
      <option value="4">≤ 4 months</option>
      <option value="5">≤ 5 months</option>
      <option value="6">≤ 6 months</option>
      <option value=">6">&gt; 6 months</option>
    </select>
  </div>
</div>

  
      <ul className="space-y-4 p-0 list-none">
        {filteredJobs.map((job, index) => (
          <li
          key={index}
          onDoubleClick={() => handleClaimJob(job)}
          className="job-card"
        >
          <h3 className="job-title">{job.title}</h3>
        
          <div className="job-meta">
            <span><strong>Experience:</strong> {job.experienceLevel || 'N/A'}</span>
            <span><strong>Pay:</strong> {job.pay || 'N/A'}</span>
            <span><strong>Duration:</strong> {job.duration || 'N/A'}</span>
          </div>
        
          <p className="job-description">{job.description}</p>
        
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="job-link"
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
