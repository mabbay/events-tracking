// test companies middleware function
const mongoose = require('mongoose');
const { server, app } = require('../../../app');
const { companies } = global.Middlewares.modules;

afterAll(async () => { await server.close(app); });

let req; // fake req
beforeEach(() => {
  req = { body: {}, session: {}, params: {}, filters: {} };
  const user = new global.Components.users.Model({ company: new mongoose.Types.ObjectId() });
  req.session.user = user;
});

describe('middleware: companies', () => {
  it('should set req.filters._id to user.company', async () => {
    const res = await companies(req);
    expect(res.status).toBe(200);
    expect(req.filters).toHaveProperty('_id', req.session.user.company);
  });
  it('should delete company from req.filters', async () => {
    req.filters.company = new mongoose.Types.ObjectId();
    const res = await companies(req);
    expect(res.status).toBe(200);
    expect(req.filters).not.toHaveProperty('company');
  });
})