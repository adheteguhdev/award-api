import addContext from 'mochawesome/addContext';
import chai from 'chai';
import chaiHttp from 'chai-http';
import createApp from '../../app';
import { closeDatabase } from '../../config/database';
const assert = chai.assert;
const expect = chai.expect;
import { userData } from '../data/user';
import User from '../../models/user';

chai.use(chaiHttp);

let app;

describe('User Sign In', () => {
  before(async () => {
    app = await createApp();
    await User.deleteMany({});
    await User.insertMany(userData);
  });

  after(async () => {
    await User.deleteMany({});
    await closeDatabase();
  });

  it('User sign in success', function (done) {
    chai
      .request(app)
      .post(`/user/signin`)
      .send({
        "email": "john@doe.com",
      })
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('object')
        assert.isNotEmpty(res.body);
        done();
      });
  });

  it('User sign in fail when email doesnt exist', function (done) {
    chai
      .request(app)
      .post(`/user/signin`)
      .send({
        "email": "test@fail.com",
      })
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(400);
        expect(res.body).have.an('object')
        assert.equal(res.body.message, 'Email Address is not exists');
        assert.isNotEmpty(res.body);
        done();
      });
  });

});
