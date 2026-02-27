const axios = require('axios');

export default async function handler(req, res) {
    // Permisos CORS para que tu web local pueda leer los datos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta búsqueda' });

    // URL real de CustomsForge
    const targetUrl = `https://ignition4.customsforge.com/search/get_data?search=${encodeURIComponent(q)}&length=1`;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://ignition4.customsforge.com/'
            }
        });
        // Enviamos los datos de vuelta a tu web
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la petición', details: error.message });
    }
}
