const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const expect = chai.expect;
const parisCoord = require('../config/constant.config').parisCoord;
let timeoutMocha = require('../config/constant.config').mocha.timeout;

chai.use(chaiHttp);
describe('Test function findAirQuality', () => {
    before(async function() {
        // Delais d'attente de mocha
        this.timeout(timeoutMocha); 
        await new Promise(resolve => app.once('serverReady', resolve));
    });
    describe('GET /findAirQuality', () => {
        it('should return air quality data for specified coordinates', async () => {
            try {
                // execute findAirQuality avec les params lat et lon
                const res = await chai.request(app).get(`/findAirQuality?lat=${parisCoord.lat}&lon=${parisCoord.lon}`); 
                expect(res).to.have.status(200);
                expect(res.body.result.pollution).to.have.property('ts');
                expect(res.body.result.pollution).to.have.property('aqius');
                expect(res.body.result.pollution).to.have.property('mainus');
                expect(res.body.result.pollution).to.have.property('aqicn');
                expect(res.body.result.pollution).to.have.property('maincn');
                // l'aqius dans pollution devrait etre superieur a 0
                expect(res.body.result.pollution.aqius).to.above(0);
            } catch (error) {
                throw error;
            }
        });

        it('should return an error for missing coordinates', async () => {
            try {
                // execute findAirQuality sans les params lat et lon
                const res = await chai.request(app).get('/findAirQuality');
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.equal('Les paramètres lat et lon sont requis.');
            } catch (error) {
                throw error;
            }
        });
    });
});

describe('Test function startCron', () => {
    it('should start the cron', (done) => {
        // execute startCron 
        chai.request(app).get('/startCron')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').equal('Le CRON a été démarré avec succès.');
                done();
            });
    });
});