const pollutionService = require('../services/pollution.services');
const cron = require('node-cron');
const parisCoord = require('../config/constant.config').parisCoord;
const Pollution = require('../models/pollution.models');

exports.getQAirByCoord  = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon || lat.trim() === '' || lon.trim() === '') {
        return res.status(400).json({ error: 'Les paramètres lat et lon sont requis.' });
    }

    try {
        const pollutionData = await pollutionService.getPollutionByCoord(lat, lon);
        const formatedData = {
            result: {
                pollution: {
                    ts: pollutionData.data.current.pollution.ts,
                    aqius: pollutionData.data.current.pollution.aqius,
                    mainus: pollutionData.data.current.pollution.mainus,
                    aqicn: pollutionData.data.current.pollution.aqicn,
                    maincn: pollutionData.data.current.pollution.maincn
                }
            }
        };
        res.json(formatedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message }); 
    }
};

exports.getAllPollutions = async (req, res) => {
    try {
        const pollutionData = await Pollution.find({});
        if(pollutionData === null || pollutionData === undefined){
            return res.status(500).json({error: 'Erreur lors de la récuperation des données de qualité de l\'air dans la base'});
        }
        console.log("pollutionData "+JSON.stringify(pollutionData));
        res.json(pollutionData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récuperation des données de qualité de l\'air dans la base, error : ' +error.message }); 
    }
};

exports.startCron = async (req, res) => {
    let { minute = '*', hour = '*', dayOfMonth = '*', month = '*', dayOfWeek = '*' } = req.query;

    minute = minute || '*';
    hour = hour || '*';
    dayOfMonth = dayOfMonth || '*';
    month = month || '*';
    dayOfWeek = dayOfWeek || '*';

    const schedule = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    console.log('schedule '+JSON.stringify(schedule));
    cron.schedule(schedule, async () => {
        try {
            const parisPollutionData = await pollutionService.getPollutionByCoord(parisCoord.lat, parisCoord.lon);
            if( parisPollutionData === null || parisPollutionData === undefined) {
                return res.status(500).json({ error: 'Erreur lors de la récuperation des données de qualité de l\'air a Paris:' });
            };
            let currentPollution = new Pollution({
                ts: parisPollutionData.data.current.pollution.ts,
                aqius: parisPollutionData.data.current.pollution.aqius,
                mainus: parisPollutionData.data.current.pollution.mainus,
                aqicn: parisPollutionData.data.current.pollution.aqicn,
                maincn: parisPollutionData.data.current.pollution.maincn
            });
            try {
                const savedPollution = await currentPollution.save();
                console.log('Données de qualité de l\'air de Paris enregistrées :', savedPollution);
            } catch (err){
                console.error('Erreur lors de l\'enregistrement des données de qualité de l\'air de Paris :', err);
                throw err;
            };
            console.log('Le CRON a été démarré avec succès.');
            // res.status(200).json({ message: 'Le CRON a été démarré avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la récuperation des données de qualité de l\'air de Paris:', error);
            return res.status(500).json({ error: 'Erreur lors de la récuperation des données de qualité de l\'air a Paris, Error : '+error });
        }
    });
};

exports.getMostPollutedDatetime = async (req, res) => {
    try {
        const pollutionData = await Pollution.find();
        if(pollutionData === null || pollutionData === undefined) {
            res.status(500).json({ error: 'Erreur lors de la récupération des données dans pollution' });
        }
        pollutionData.sort((a, b) => b.aqius - a.aqius);
        const mostPollutedDatetime = pollutionData[0].ts;
        res.status(200).json({ mostPollutedDatetime });
    } catch (error) {
        console.error('Erreur lors de la récupération de la DATETIME la plus polluée :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la DATETIME la plus polluée.' });
    }
}
