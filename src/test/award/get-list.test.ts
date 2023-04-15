import addContext from 'mochawesome/addContext';
import chai from 'chai';
import chaiHttp from 'chai-http';
import createApp from '../../app';
import { closeDatabase } from '../../config/database';
const assert = chai.assert;
const expect = chai.expect;
import { awardData } from '../data/award';
import Award from '../../models/award';
import token from '../data/token';

chai.use(chaiHttp);

let app;

describe('Get all awards', () => {
  before(async () => {
    app = await createApp();
    await Award.deleteMany({});
    await Award.insertMany(awardData);
  });

  after(async () => {
    await Award.deleteMany({});
    await closeDatabase();
  });

  it('Should get all awards', function (done) {
    chai
      .request(app)
      .get(`/award`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('array')
        assert.isNotEmpty(res.body);
        done();
      });
  });

  it('Should not get awards when allowedkey invalid', function (done) {
    chai
      .request(app)
      .get(`/award?name=Products`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(400);
        assert.equal(res.body.message, 'Invalid Query Parameters');
        assert.isNotEmpty(res.body);
        done();
      });
  });

  it('Should get awards with filters', function (done) {
    const type = "Products"
    chai
      .request(app)
      .get(`/award?type=${type}`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('array')
        assert.equal(res.body[0].type, type);
        assert.isNotEmpty(res.body);
        done();
      });
  });

});
