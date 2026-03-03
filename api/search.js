const axios = require('axios');

export default async function handler(req, res) {
    // Manejo de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta búsqueda' });

    // Intentamos usar la URL de búsqueda que mejor funciona sin cookies constantes
    const targetUrl = `https://ignition4.customsforge.com/search/get_data`;

    try {
        const response = await axios.get(targetUrl, {
            timeout: 8000, 
            params: {
                "draw": 1,
                "columns[0][data]": "artist",
                "search[value]": q, // Aquí pasamos la búsqueda
                "start": 0,
                "length": 1 // Solo queremos el primer resultado
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': 'https://ignition4.customsforge.com/',
                'X-Requested-With': 'XMLHttpRequest',
                // Si esto falla, el siguiente paso sería añadir aquí una cookie de sesión manual
            }
        });
        
        // CustomsForge a veces devuelve un objeto con aaData
        res.status(200).json(response.data);

    } catch (error) {
        console.error("❌ Error en Proxy:", error.response ? error.response.status : error.message);
        
        // Si da 403 o 401, es que CF bloqueó la IP de Vercel o pide Login
        res.status(error.response ? error.response.status : 500).json({ 
            error: 'CustomsForge rechazó la conexión', 
            details: error.message 
        });
    }
}
