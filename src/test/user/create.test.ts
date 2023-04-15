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

describe('Create user', () => {
  before(async () => {
    app = await createApp();
    await User.deleteMany({});
    await User.insertMany(userData);
  });

  after(async () => {
    await User.deleteMany({});
    await closeDatabase();
  });

  it('Should create user', function (done) {
    chai
      .request(app)
      .post(`/user`)
      .send({
        "email": "johndoe@success.com",
        "name": "Test John",
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

  it('Should not create user email must uniqe', function (done) {
    chai
      .request(app)
      .post(`/user`)
      .send({
        "email": "test@test.com",
        "name": "Test email exist",
      })
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(400);
        expect(res.body).have.an('object')
        assert.equal(res.body.message, 'Email already exist');
        assert.isNotEmpty(res.body);
        done();
      });
  });

});
