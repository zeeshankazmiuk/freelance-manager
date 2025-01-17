const axios = require('axios');
require('dotenv').config();

const UPWORK_ACCESS_TOKEN = 'will put access token here later'; 

// fetch job leads
const getJobLeads = async () => {
  const url = 'will place endpoint here later';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${UPWORK_ACCESS_TOKEN}`
      },
      params: {
        q: 'JavaScript',  // test search querey - to be changed later
        category: 'Web Development' // test category - to be changed later
      }
    });

    console.log("Job Leads:", response.data);
  } catch (error) {
    console.error("Error fetching job leads:", error);
  }
};

// fetch job leads
getJobLeads();
