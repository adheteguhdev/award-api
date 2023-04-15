import addContext from 'mochawesome/addContext';
import chai from 'chai';
import chaiHttp from 'chai-http';
import createApp from '../../app';
import { closeDatabase } from '../../config/database';
const assert = chai.assert;
const expect = chai.expect;
import { userData } from '../data/user';
import User from '../../models/user';
import token from '../data/token';

chai.use(chaiHttp);

let app;

describe('Get user by id', () => {
  before(async () => {
    app = await createApp();
    await User.deleteMany({});
    await User.insertMany(userData);
  });

  after(async () => {
    await User.deleteMany({});
    await closeDatabase();
  });

  it('Should get user by id', function (done) {
    chai
      .request(app)
      .get(`/user/${userData[0]._id}`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('object')
        assert.isNotEmpty(res.body);
        done();
      });
  });

  it('Should return 404 when resource not found', function (done) {
    chai
      .request(app)
      .get(`/user/testnotfound123`)
      .set("Authorization", `Bearer ${token.valid}`)
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
