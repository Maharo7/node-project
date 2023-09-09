const axios = require('axios');
const envConfig = require('../config/env.config');
const { PollutionSchema } = require('../models/pollution.models');
const mongoose = require('mongoose');
const Pollution = mongoose.model(envConfig.collection,PollutionSchema);

exports.getPollutionByCoord = async (lat, lon) => {
    const apiKey = envConfig.API_KEY;
    const baseUrl = envConfig.IQAirUrl;
    const endpoints = envConfig.endPoints1;

    try {
        const response = await axios.get(`${baseUrl}${endpoints}?lat=${lat}&lon=${lon}&key=${apiKey}`);
        if (response === null || response === undefined) {
            throw new Error('Erreur lors de la récupération des données de qualité de l\'air.');
        } 
        const responseData = response.data;           
        return responseData;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des données de qualité de l\'air.');
    }
}
