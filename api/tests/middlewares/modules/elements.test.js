const mongoose = require('mongoose');
const request = require('supertest');
const { server, app } = require('../../../app');
const { elements } = global.Middlewares.modules;

afterAll(async () => {
  await global.Components.users.Model.deleteMany({});
  await global.Components.companies.Model.deleteMany({});
  await global.Components.websites.Model.deleteMany({});
  await server.close(app);
});

let user, website, otherWebsite;
beforeAll(async () => {
  const body = { firstName: 'aaa', lastName: 'bbb', email: 'a@gmail.com', password: '123456' };
  const res = await request(app).post('/api/users/signup').send(body);
  user = res.body;
  // create a website attached to the user's company
  website = await global.Components.websites.Model.create({
    domain: 'a.com', company: user.company
  });
  // create a website that's not attached to the user's company
  otherWebsite = await global.Components.websites.Model.create({
    domain: 'b.com', company: new mongoose.Types.ObjectId()
  });
});

let req; // fake req
beforeEach(() => {
  req = { body: {}, session: {}, params: {}, filters: {} };
  req.session.user = user;
});

describe('middleware: elements', () => {
  it('should return 400 if action is create and req.body.website is not set', async () => {
    req.params.action = 'create';
    req.body.website = undefined;
    const res = await elements(req);
    expect(res.status).toBe(400);
  });
  it('should return 400 if action is get|search|update|delete and req.filters.website is not set', async () => {
    const actions = ['get', 'search', 'update', 'delete'];
    for (const action of actions) {
      req.params.action = action;
      req.filters.website = undefined;
      const res = await elements(req);
      expect(res.status).toBe(400);
    }
  });
  it('should return 404 if action is create and req.body.website is set and the website does not exist', async () => {
    req.params.action = 'create';
    req.body.website = new mongoose.Types.ObjectId(); // fake website
    const res = await elements(req);
    expect(res.status).toBe(404);
  });
  it('should return 404 if action is create and req.body.website is set and the website does not belongs to the user\'s company', async () => {
    req.params.action = 'create';
    req.body.website = otherWebsite._id;
    const res = await elements(req);
    expect(res.status).toBe(404);
  });
  it('should return 404 if action is get|search|update|delete and req.filters.website is set and the website does not exist', async () => {
    const actions = ['get', 'search', 'update', 'delete'];
    req.filters.website = new mongoose.Types.ObjectId(); // a fake website
    for (const action of actions) {
      req.params.action = action;
      const res = await elements(req);
      expect(res.status).toBe(404);
    }
  });
  it('should return 404 if action is get|search|update|delete and req.body.filters is set and the website does not belong to the user\'s company', async () => {
    const actions = ['get', 'search', 'update', 'delete'];
    req.filters.website = otherWebsite._id;
    for (const action of actions) {
      req.params.action = action;
      const res = await elements(req);
      expect(res.status).toBe(404);
    }
  });
  it('should return 200 if action is create and req.body.website is set and the website exists and bleong to the user\'s company', async () => {
    req.params.action = 'create';
    req.body.website = website._id;
    const res = await elements(req);
    expect(res.status).toBe(200);
  });
  it('should return 200 if action is get|search|update|delete and req.filters.website is set and the website exists and bleong to the user\'s company', async () => {
    const actions = ['get', 'search', 'update', 'delete'];
    req.filters.website = website._id;
    for (const action of actions) {
      req.params.action = action;
      const res = await elements(req);
      expect(res.status).toBe(200);
    }
  });
});

