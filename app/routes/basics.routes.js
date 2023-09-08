module.exports.basicRoutes = (app) => {
    const iqAirController = require('../controllers/iqAir.controller');

    app.get('/', function (req, res) {
        res.send('Hello World Maharo');
     })

    app.get('/findAirQuality', iqAirController.getQAirByCoord);
}