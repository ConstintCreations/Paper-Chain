import fetch from 'node-fetch';

export default async function handler(request, response) {
    const LIVECOINWATCH_API_KEY = process.env.LIVECOINWATCH_API_KEY;
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
        response.status(200).json(data);
    } catch (error) {
        response.status(500).send('Error fetching coin history: ' + error.message);
    }
}