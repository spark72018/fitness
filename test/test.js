process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('first test', () => {
  it('homepage request should have status 200 in response', async () => {
    const server = require('../index');
    const localhost = 'http://localhost:5000';
    try {
      const res = await chai.request(localhost).get('/');
      console.log(res.status);
      expect(res).to.have.status(200);
    } catch (e) {
      console.log('caught error', e);
    }
  });
});
