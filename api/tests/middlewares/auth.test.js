const mongoose = require('mongoose');
const { server, app } = require('../../app');
const { auth } = global.Middlewares;

afterAll(async () => { await server.close(app); });

let req, user;
beforeEach(() => {
  req = { headers: {} };
  user = new Components.users.Model({ company: new mongoose.Types.ObjectId() });
});

describe('middleware: auth', () => {
  it('shoud return 401 if auth-token does not exists in req.headers', async () => {
    const res = await auth(req);
    expect(res.status).toBe(401);
  });
  it('should return 400 if auth-token is provided but not valid', async () => {
    req.headers['x-auth-token'] = getInvalidAuthToken();
    const res = await auth(req);
    expect(res.status).toBe(400);
  });
  it('should return 200 if auth-token is valid', async () => {
    req.headers['x-auth-token'] = user.authToken(); // get a valid auth token
    const res = await auth(req);
    expect(res.status).toBe(200);
  });
  it('should put user-id and company-id in req.session if auth-token is valid', async () => {
    req.headers['x-auth-token'] = user.authToken();
    await auth(req);
    expect(req.session).toHaveProperty('user',
      { _id: user._id.toString(), company: user.company.toString() });
  });
});

// to get an invalid token
function getInvalidAuthToken() {
  const payload = {
    userId: new mongoose.Types.ObjectId(), companyId: new mongoose.Types.ObjectId()
  };
  const key = 'aaa'; // any key that's different than the one we are using
  const token = Utils.jwt.sign(payload, key);
  return token;
}