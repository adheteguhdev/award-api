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

describe('Get all users', () => {
  before(async () => {
    app = await createApp();
    await User.deleteMany({});
    await User.insertMany(userData);
  });

  after(async () => {
    await User.deleteMany({});
    await closeDatabase();
  });

  it('Should get all users', function (done) {
    chai
      .request(app)
      .get(`/user`)
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

  it('Should not get user when allowedkey invalid', function (done) {
    chai
      .request(app)
      .get(`/user?name=test`)
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

  it('Should get user with filters', function (done) {
    const email = "john@doe.com"
    chai
      .request(app)
      .get(`/user?email=${email}`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(200);
        expect(res.body).have.an('array')
        assert.equal(res.body[0].email, email);
        assert.isNotEmpty(res.body);
        done();
      });
  });
});
