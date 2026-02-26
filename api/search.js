const axios = require('axios');

module.exports = async (req, res) => {
  // Habilitamos CORS para que TU página pueda hablar con ESTE proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { search } = req.query;
  const targetUrl = `https://ignition4.customsforge.com/search/get_data?search=${encodeURIComponent(search)}&length=1`;

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://ignition4.customsforge.com/',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con CustomsForge' });
  }
};
