import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

// Load environment variables from .env file
dotenv.config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const UID = process.env.UID;

if (!AUTH_TOKEN || !UID) {
  console.error("Error: Missing AUTH_TOKEN or UID in .env file.");
  process.exit(1);
}

const url = 'https://api.depinscan.io/api/upload-device-metrics';

async function uploadMetrics(data) {
  const headers = {
    "version": "1.0",
    "Content-Type": "application/json",
    "Authorization": AUTH_TOKEN,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Success:', responseData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function processCSV(filePath) {
  const requests = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Assume the CSV has columns: publisher, longitude, latitude
      const data = {
        uid: UID,
        events: [
          {
            publisher: row.publisher,
            custom: {
              longitude: parseFloat(row.longitude),
              latitude: parseFloat(row.latitude),
            },
          },
        ],
      };
      requests.push(data);
    })
    .on('end', async () => {
      console.log('CSV file processed. Sending requests...');
      for (const requestData of requests) {
        await uploadMetrics(requestData);
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err.message);
    });
}

// Path to your CSV file
const csvFilePath = './data.csv';
processCSV(csvFilePath);
