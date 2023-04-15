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

describe('Update award', () => {
  before(async () => {
    app = await createApp();
    await Award.deleteMany({});
    await Award.insertMany(awardData);
  });

  after(async () => {
    await Award.deleteMany({});
    await closeDatabase();
  });

  const dataUpdate = {
    ...awardData[1],
    "point": 5000000,
  }

  it('Should update award', function (done) {
    chai
      .request(app)
      .put(`/award/${awardData[1]._id}`)
      .set("Authorization", `Bearer ${token.valid}`)
      .send(dataUpdate)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('object')
        assert.equal(res.body.point, dataUpdate.point)
        assert.isNotEmpty(res.body);
        done();
      });
  });

  it('Should return 404 when resource not found', function (done) {
    chai
      .request(app)
      .put(`/award/testnotfound123`)
      .set("Authorization", `Bearer ${token.valid}`)
      .send(dataUpdate)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(404);
        expect(res.body).have.an('object')
        assert.equal(res.body.message, 'Data Not Found');
        assert.isNotEmpty(res.body);
        done();
      });
  });

});
