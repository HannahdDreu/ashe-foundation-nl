// Netlify Function to handle Laposta subscription
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.email || !data.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing required fields' })
      };
    }

    // Your secure API credentials
    const API_KEY = process.env.LAPOSTA_API_KEY;
    const LIST_ID = process.env.LAPOSTA_LIST_ID;
    
    // Get client IP 
    let clientIP = event.headers['client-ip'] || 
                   event.headers['x-forwarded-for'] || 
                   '127.0.0.1';
    
    // Convert IPv6 localhost to IPv4
    if (clientIP === '::1' || clientIP.includes(':')) {
      clientIP = '127.0.0.1';
    }
    
    console.log('Using List ID:', LIST_ID);
    console.log('Using IP:', clientIP);
    console.log('Using email:', data.email);
    console.log('Using name:', data.name);
    
    // Split name into first name and last name
    const nameParts = data.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    console.log('Mapped to first name:', firstName);
    console.log('Mapped to last name:', lastName);
    
    // Try the correct endpoint based on API documentation
    const apiUrl = 'https://api.laposta.nl/v2/member';
    
    const payload = {
      list_id: LIST_ID,
      email: data.email,
      ip: clientIP,
      source_url: "https://ashefoundation.nl/contact",
      custom_fields: {
        voornaam: firstName,
        achternaam: lastName
      }
    };
    
    console.log('Request URL:', apiUrl);
    console.log('Request body:', JSON.stringify(payload));

    // Call Laposta API with Basic Auth
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64')
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    console.log('API Response:', JSON.stringify(responseData));

    // Handle response
    if (response.ok && responseData.member) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed',
          data: responseData.member 
        })
      };
    }

    // Handle errors
    let errorMessage = 'Unknown error';
    if (responseData.error) {
      errorMessage = responseData.error.message || 'API error';
      if (responseData.error.type === 'not_unique') {
        errorMessage = 'This email is already subscribed';
      }
    }
    
    return {
      statusCode: response.status || 400,
      body: JSON.stringify({ 
        success: false, 
        error: errorMessage 
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      })
    };
  }
};