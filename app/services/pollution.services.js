const axios = require('axios');
const envConfig = require('../config/env.config');
const Pollution = require('../models/pollution.models');

async function getPollutionByCoord(lat, lon) {
    const apiKey = envConfig.API_KEY;
    const baseUrl = envConfig.IQAirUrl;
    const endpoints = envConfig.endPoints1;

    try {
        const response = await axios.get(`${baseUrl}${endpoints}?lat=${lat}&lon=${lon}&key=${apiKey}`);
        if (response === null || response === undefined) {
            throw new Error('Erreur lors de la récupération des données de qualité de l\'air.');
        } 
        const responseData = response.data;            
        return new Pollution(
            responseData.data.current.pollution.ts,
            responseData.data.current.pollution.aqius,
            responseData.data.current.pollution.mainus,
            responseData.data.current.pollution.aqicn,
            responseData.data.current.pollution.maincn
        );

    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des données de qualité de l\'air.');
    }
}
module.exports = { getPollutionByCoord };