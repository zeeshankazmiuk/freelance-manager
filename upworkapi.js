const axios = require('axios');
require('dotenv').config();

const UPWORK_ACCESS_TOKEN = 'your_access_token_here'; // Replace with actual access token

// Example function to fetch job leads
const getJobLeads = async () => {
  const url = 'https://www.upwork.com/api/v3/jobs/search.json'; // Example endpoint

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${UPWORK_ACCESS_TOKEN}`
      },
      params: {
        q: 'JavaScript',  // Search query, modify based on your needs
        category: 'Web Development' // Example category, can be changed
      }
    });

    console.log("Job Leads:", response.data);
  } catch (error) {
    console.error("Error fetching job leads:", error);
  }
};

// Fetch job leads
getJobLeads();
