const pollutionService = require('../services/pollution.services');

module.exports.getQAirByCoord = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon || lat.trim() === '' || lon.trim() === '') {
        return res.status(400).json({ error: 'Les paramètres lat et lon sont requis.' });
    }

    try {
        const pollutionData = await pollutionService.getPollutionByCoord(lat, lon);
        const formatedData = {
            result: {
                pollution : pollutionData
            }
        };
        res.json(formatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};