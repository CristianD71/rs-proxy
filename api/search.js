const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta búsqueda' });

    const targetUrl = `https://ignition4.customsforge.com/search/get_data`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 10000, 
            params: {
                "draw": 1,
                "columns[0][data]": "artist",
                "search[value]": q,
                "start": 0,
                "length": 1 
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': 'https://ignition4.customsforge.com/',
                'X-Requested-With': 'XMLHttpRequest',
                // PEGA TU COOKIE AQUÍ ABAJO:
                'Cookie': 'ips4_IPSSessionFront=d01921364221266aed649e1a93bff497; ips4_member_id=253608' 
            }
        });
        
        res.status(200).json(response.data);

    } catch (error) {
        // Esto nos dirá si es 403 (Prohibido) o 500
        res.status(error.response ? error.response.status : 500).json({ 
            error: 'Error en la conexión', 
            code: error.response ? error.response.status : 'No Response'
        });
    }
}
