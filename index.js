import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 3000;
const LIVECOINWATCH_API_KEY = process.env.LIVECOINWATCH_API_KEY;

app.use(express.static(__dirname));
app.use('/libs', express.static(__dirname + '/node_modules'));

app.get('/api/coins', async (request, response) => {
    const codes = request.query.codes ? request.query.codes.split(',') : ['BTC', 'ETH', 'XRP'];
    try {
        const apiResponse = await fetch('https://api.livecoinwatch.com/coins/map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': LIVECOINWATCH_API_KEY
            },
            body: JSON.stringify({
                currency: 'USD',
                codes: codes,
                sort: 'rank',
                order: 'ascending',
                offset: 0,
                meta: true,
            })
        });
        
        const data = await apiResponse.json();
        response.json(data);
    } catch (error) {
        response.status(500).send('Error fetching coin history: ' + error.message);
    }
});

app.get('/api/coin/history', async (request, response) => {
    const code = request.query.code || 'BTC';
    try {
        const apiResponse = await fetch('https://api.livecoinwatch.com/coins/single/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': LIVECOINWATCH_API_KEY
            },
            body: JSON.stringify({
                currency: 'USD',
                code: code,
                start: Date.now() - 24 * 60 * 60 * 1000, 
                end: Date.now()
            })
        });
        
        const data = await apiResponse.json();
        response.json(data);
    } catch (error) {
        response.status(500).send('Error fetching coin history: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});