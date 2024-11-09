import fetch from 'node-fetch';

async function uploadMetrics() {
  const url = 'https://api.depinscan.io/api/upload-device-metrics';
  const headers = {
    "version": "1.0",  
    "Content-Type": "application/json",
    "Authorization": ""  /// i will put on Slack
  };

  const data = {
    "uid": "94750dca-6d50-4773-83e8-142e2202653e",  
    "events": [
      {
        "publisher": 'France-Paris',  
        "custom": {
          "longitude": 2.348,
          "latitude": 48.853
        }
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Success:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}


uploadMetrics();
