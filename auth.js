const axios = require('axios');
require('dotenv').config();

const UPWORK_CLIENT_ID = process.env.UPWORK_CLIENT_ID;
const UPWORK_CLIENT_SECRET = process.env.UPWORK_CLIENT_SECRET;
const UPWORK_REDIRECT_URI = process.env.UPWORK_REDIRECT_URI;

// direct the user to upwork authorization URL
const getAuthorizationURL = () => {
  const authorizationUrl = `https://www.upwork.com/oauth/v1/authorize?client_id=${UPWORK_CLIENT_ID}&redirect_uri=${UPWORK_REDIRECT_URI}&response_type=code&scope=read,write`;
  console.log("Go to the following URL to authenticate:", authorizationUrl);
};

// hhandle  callback exchange code for accesstoken
const getAccessToken = async (authorizationCode) => {
  const tokenUrl = 'https://www.upwork.com/api/v3/oauth2/token';
  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        client_id: UPWORK_CLIENT_ID,
        client_secret: UPWORK_CLIENT_SECRET,
        code: authorizationCode,
        redirect_uri: UPWORK_REDIRECT_URI,
        grant_type: 'authorization_code'
      }
    });
    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

//begin authorization
getAuthorizationURL();
