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

describe('Create award', () => {
  before(async () => {
    app = await createApp();
    await Award.deleteMany({});
    await Award.insertMany(awardData);
  });

  after(async () => {
    await Award.deleteMany({});
    await closeDatabase();
  });

  it('Should create award', function (done) {
    chai
      .request(app)
      .post(`/award`)
      .set("Authorization", `Bearer ${token.valid}`)
      .send({
        "type": "Vouchers",
        "point": 50000,
        "name": "Test Old Fashion Cake",
        "imageUrl": "http://test.com/test.jpg"
      })
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(201);
        expect(res.body).have.an('object')
        assert.isNotEmpty(res.body);
        done();
      });
  });

});
