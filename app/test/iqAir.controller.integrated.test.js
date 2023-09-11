const sinon = require('sinon');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const app = require('../../server');
const Pollution = require('../models/pollution.models');
const pollutionService = require('../services/pollution.services');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let mongo = null;
let timeoutMocha = require('../config/constant.config').mocha.timeout;

describe('Integration Test for startCron', () => {
    before(async function() {
      // Delais d'attente de mocha
      this.timeout(timeoutMocha); 
      await new Promise(resolve => app.once('serverReady', resolve));
  
      //create a factice base
      mongo = await MongoMemoryServer.create();
      const uri = mongo.getUri();
  
      //Disconnect to the real base before connecting to the factice base
      await mongoose.disconnect();
     // Connect to factice database
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
      // create a sanbox server with sinon 
      sandbox = sinon.createSandbox();
  
      // fake call the service
      sandbox.stub(pollutionService, 'getPollutionByCoord').callsFake(async () => {
        // Simulate the response of the service
        return {
          data: {
            current: {
              pollution: {
                ts: '2023-09-08T00:00:00.000Z',
                aqius: 42,
                mainus: 'p2',
                aqicn: 18,
                maincn: 'p2',
              },
            },
          },
        };
      });
  
      // Set clock to skip time
      clock = sinon.useFakeTimers();
    });
  
    after(async () => {
      // Stop the server in memory
      await mongoose.disconnect();
      await mongo.stop();
  
      // Restore the function sandbox and clock
      if (sandbox) {
        sandbox.restore();
      }
      if (clock) {
        clock.restore();
      }
    });
  
    it('should start the cron job and save pollution data', async () => {    
      const response = await chai.request(app).get('/startCron');
    
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('message', 'Le CRON a été démarré avec succès.');
    
      clock.tick(60000); // skipp the time to 1 min
    
      // Verify if the service getPollutionByCoord has been called
      sinon.assert.calledOnce(pollutionService.getPollutionByCoord);
    
      // Verify data in base
      const savedData = await Pollution.find({});
      expect(savedData).to.have.lengthOf(1); 
      expect(savedData[0].aqius).to.equal(42);
    
      clock.reset();
    });
  });
  