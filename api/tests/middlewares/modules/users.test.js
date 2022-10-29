// test users middleware
const mongoose = require('mongoose');
const { server, app } = require('../../../app');
const { users } = global.Middlewares.modules;

afterAll(async () => { await server.close(app); });

let req; // fake req
beforeEach(() => {
  req = { body: {}, session: {}, params: {}, filters: {} };
  const user = new global.Components.users.Model({}); // not admin by default
  req.session.user = user;
});

describe('middleware: users', () => {
  it('should delete company from request body if action is update', async () => {
    const actions = ['update'];
    for (const action of actions) {
      req.body.company = new mongoose.Types.ObjectId();
      req.params.action = action;
      const res = await users(req);
      expect(req.body).not.toHaveProperty('company');
      expect(res.status).toBe(200);
    }
  });
  it('shoud delete isAdmin from req body if action is invite and user not admin', async () => {
    req.params.action = 'invite';
    req.body.isAdmin = true;
    const res = await users(req);
    expect(res.status).toBe(200);
    expect(req.body).not.toHaveProperty('isAdmin');
  });
  it('shoud set role in req body to the user\'s role if action is invite and user not admin and role is sent', async () => {
    const { user } = req.session;
    user.role = new mongoose.Types.ObjectId(); // give the user a role 
    req.params.action = 'invite';
    req.body.role = new mongoose.Types.ObjectId();
    const res = await users(req);
    expect(res.status).toBe(200);
    expect(req.body.role).toBe(user.role);
  });
  it('should set req.filters._id to user._id if action is update and user not an admin', async () => {
    req.params.action = 'update';
    const res = await users(req);
    expect(res.status).toBe(200);
    expect(req.filters._id).toBe(req.session.user._id);
  });
  it('should delete role and isAdmin from req body if action is update and user not an admin', async () => {
    req.params.action = 'update';
    req.body.role = new mongoose.Types.ObjectId();
    req.body.isAdmin = true;
    const res = await users(req);
    expect(res.status).toBe(200);
    expect(req.body).not.toHaveProperty('role');
    expect(req.body).not.toHaveProperty('isAdmin');
  });
  it('should set req.filters._id to user._id if action is update and user is admin and req.filters._id is not set', async () => {
    req.params.action = 'update';
    const { user } = req.session;
    user.isAdmin = true;
    const res = await users(req); 
    expect(res.status).toBe(200);
    expect(req.filters._id).toBe(user._id);
  });
  it('should set req.filters._id to user._id if action is get or search and req.filters._id is not set', async () => {
    const actions = ['get', 'search'];
    for (const action of actions) {
      req.filters._id = undefined;
      req.params.action = action;
      const res = await users(req);
      expect(res.status).toBe(200);
      expect(req.filters._id).toBe(req.session.user._id);
    }
  });
});