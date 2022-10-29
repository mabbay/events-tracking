const request = require('supertest');
const mongoose = require('mongoose');
const { server, app } = require('../../app');
const { authorize } = global.Middlewares;

afterAll(async () => { await server.close(app); });

let admin, user, req;
beforeEach(async () => {
  // create an admin
  const Admindata = {
    firstName: 'admin', lastName: 'bbb', email: 'admin@gmail.com', password: 'aze123'
  };
  const res = await request(app).post('/api/users/signup').send(Admindata);
  admin = res.body;
  // create a user with a role
  const userData = {
    firstName: 'user', lastName: 'bbb', email: 'user@gmail.com', password: 'aze123',
    company: admin.company
  };
  const roleData = { // the user role
    name: 'user-role', permissions: [
      { module: 'users', access: { read: true, update: true } },
      { module: 'websites', access: { create: true } }
    ]
  };
  const role = await global.Components.roles.Model.create(roleData);
  userData.role = role._id;
  user = await global.Components.users.Model.create(userData);
  // mock req object
  req = { session: { user: { _id: user.id, company: user.company } } };
  req.params = { module: 'users', action: 'create' }; // random values
  req.filters = {}; req.body = {};
  // mock users middleware, because it's going to be called by authorize (module === 'users')
  Middlewares.modules.users = jest.fn().mockReturnValue(new Response);
});

afterEach(async () => {
  await global.Components.users.Model.deleteMany({});
  await global.Components.companies.Model.deleteMany({});
  await global.Components.roles.Model.deleteMany({});
});

describe('middleware: authorize', () => {
  it('should return 404 response status if user not found', async () => {
    const userId = new mongoose.Types.ObjectId();
    req.session.user._id = userId;
    const res = await authorize(req);
    expect(res.status).toBe(404);
  });
  it('should return 403 if user not admin and without any role', async () => {
    await global.Components.users.Model.updateOne({ firstName: 'user' }, { role: null });
    const res = await authorize(req);
    expect(res.status).toBe(403);
  });
  it('should return 403 if user not admin and without the right permission', async () => {
    const params = [
      { module: 'users', action: 'create' },// the user has access on users but not the create action
      { module: 'elements', action: 'get' } // the user does not have access on elements at all
    ];
    // mock elements middleware
    Middlewares.modules.elements = jest.fn().mockReturnValue(new Response);
    for (const param of params) {
      req.params = param;
      const res = await authorize(req);
      expect(res.status).toBe(403);
    }
  });
  it('should return 200 if user not admin and with the right permission', async () => {
    const params = [ // some of the actions the user can do
      { module: 'users', action: 'update' },
      { module: 'websites', action: 'create' }
    ];
    for (const param of params) {
      req.params = param;
      const res = await authorize(req);
      expect(res.status).toBe(200);
    }
    // we expect users middleware to be called since req.params.module === 'users'
    expect(Middlewares.modules.users).toHaveBeenCalled();
  });
  it('should return 200 if an admin', async () => {
    req.session.user._id = admin._id;
    const res = await authorize(req);
    expect(res.status).toBe(200);
    // we expect users middleware to be called since req.params.module === 'users'
    expect(Middlewares.modules.users).toHaveBeenCalled();
  });
  // general restrictions has different effects based on the action
  // if action is create: we set req.body.company to user.company
  // else we set req.filters.company to user.company
  it('should apply general restrictions if user has permission and action is create', async () => {
    req.params.module = 'websites'; req.params.action = 'create';
    const res = await authorize(req);
    expect(res.status).toBe(200);
    expect(req.body).toHaveProperty('company', user.company.toString());
  });
  it('should apply general restrictions if user has permission and action is read | update | delete', async () => {
    // it's enough to test only one, in our case it's update action on users
    req.params.action = 'update';
    const res = await authorize(req);
    expect(res.status).toBe(200);
    expect(req.filters).toHaveProperty('company', user.company);
  });
  it('should call the specific middleware associated with the module', async () => {
    // these are the modules that have specific middlewares
    const modules = ['users', 'elements', 'companies'];
    // we will work with the admin since he has permissions
    req.session.user._id = admin._id;
    for (const module of modules) {
      Middlewares.modules[module] = jest.fn().mockReturnValue(new Response);
      req.params.module = module;
      const res = await authorize(req);
      expect(res.status).toBe(200);
      expect(Middlewares.modules[module]).toHaveBeenCalled();
    }
  });
});