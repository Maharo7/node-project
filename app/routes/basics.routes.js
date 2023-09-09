module.exports.basicRoutes = (app) => {
    const iqAirController = require('../controllers/iqAir.controller');

    app.get('/', function (req, res) {
        res.send('Hello World Maharo');
     })

    app.get('/findAirQuality', iqAirController.getQAirByCoord);
    app.get('/findAllPollutionDb', iqAirController.getAllPollutions);
    app.get('/startCron', iqAirController.startCron);
    app.get('/mostPollutedDatetime', iqAirController.getMostPollutedDatetime);
}