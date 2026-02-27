const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta búsqueda' });

    // Cambiamos la URL a la versión que usa el buscador de la tabla directamente
    const targetUrl = `https://ignition4.customsforge.com/search/get_data?search=${encodeURIComponent(q)}&length=1`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 5000, // Si tarda más de 5 seg, abortamos
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://ignition4.customsforge.com/',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        // Esto nos dirá exactamente qué pasó en los logs de Vercel
        console.error("Error detallado:", error.response ? error.response.status : error.message);
        res.status(500).json({ 
            error: 'Error al conectar a CustomsForge', 
            status: error.response ? error.response.status : 'Timeout/Network Error'
        });
    }
}
