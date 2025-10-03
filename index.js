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

app.get('/api/coin', async (request, response) => {
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
                code: codes,
                meta: true,
                sort: 'rank',
                order: 'ascending',
                offset: 0,
                limit: codes.length
            })
        });
        const data = await apiResponse.json();
        response.json(data);
    } catch (error) {
        response.status(500).send('Error fetching coin data: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});