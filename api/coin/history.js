import fetch from 'node-fetch';

export default async function handler(request, response) {
    const LIVECOINWATCH_API_KEY = process.env.LIVECOINWATCH_API_KEY;
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
}