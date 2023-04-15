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

describe('Delete award by id', () => {
  before(async () => {
    app = await createApp();
    await Award.deleteMany({});
    await Award.insertMany(awardData);
  });

  after(async () => {
    await Award.deleteMany({});
    await closeDatabase();
  });

  it('Should delete award by id', function (done) {
    chai
      .request(app)
      .delete(`/award/${awardData[3]._id}`)
      .set("Authorization", `Bearer ${token.valid}`)
      .end((err, res) => {
        if (err) return done(err);
        addContext(this, { title: 'Response Body', value: res.body });
        expect(res.status).to.be.eq(204);
        Award.findOne({ _id: awardData[3]._id }).then((award) => {
          assert.equal(award.isDeleted, true);
        })
        done();
      });
  });

  it('Should not delete award and return 404 when resource not found', function (done) {
    chai
      .request(app)
      .delete(`/award/testnotfound123`)
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
