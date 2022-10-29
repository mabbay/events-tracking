const request = require('supertest');
const { server, app } = require('../../app');

afterAll(async () => { await server.close(app); });

describe('/api/users', () => {

  describe('/signup', () => {
    let params;
    const exec = () => request(app).post('/api/users/signup').send(params);
    beforeEach(async () => {
      params = {
        firstName: 'mourad', lastName: 'abbay', email: 'm.abbay@gmail.com', password: 'aze123'
      };
    });
    afterEach(async () => {
      await global.Components.users.Model.deleteMany({});
      await global.Components.companies.Model.deleteMany({});
    });

    it('should send 400 response status if firstName is not valid', async () => {
      // cases: not provided, not a string, lenght > 50
      const invalidFirstNames = ['', 123, Array(52).join('a')];
      for (const invalidFirstName of invalidFirstNames) {
        params.firstName = invalidFirstName;
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.text).toContain('firstName');
      }
    });
    it('should send 400 response status if email is not valid', async () => {
      // cases: not provided, not valid
      const invalidEmails = ['', 'abc'];
      for (const invalidEmail of invalidEmails) {
        params.email = invalidEmail;
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.text).toContain('email');
      }
    });
    it('should send 400 response status if password is not valid', async () => {
      // cases: not provided, not a string, length < 3, length > 255
      const invalidPasswords = ['', 123, 'ab', new Array(257).join('a')];
      for (const invalidPassword of invalidPasswords) {
        params.password = invalidPassword;
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.text).toContain('password');
      }
    });
    it('should send 400 response status if company is not valid', async () => {
      // cases: not provided, not valid
      const invalidCompanies = [123, new Array(52).join('a')];
      for (const invalidCompany of invalidCompanies) {
        params.company = invalidCompany;
        const res = await exec();
        expect(res.status).toBe(400);
        expect(res.text).toContain('company');
      }
    });
    it('should create a company with the name: {{firstname}} of the user, if company name is not provided', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      const company = await Components.companies.Model.findOne();
      expect(company).not.toBeNull();
      expect(company).toHaveProperty('name', params.firstName);
    });
    it('should create a company with the name given in the request body', async () => {
      params.company = 'a'; // company name
      const res = await exec();
      expect(res.status).toBe(200);
      const company = await Components.companies.Model.findOne();
      expect(company).not.toBeNull();
      expect(company).toHaveProperty('name', params.company);
    });
    it('should create the user and link him to his company', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      const user = await Components.users.Model.findOne();
      expect(user).not.toBeNull();
      expect(user).toHaveProperty('email', params.email);
      expect(user).toHaveProperty('isAdmin', true);
      const company = await Components.companies.Model.findOne();
      expect(company).not.toBeNull();
      expect(user.company.toString()).toBe(company._id.toString());
    });
    it('should send the created user in the response body', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('firstName', params.firstName);
      expect(res.body).toHaveProperty('lastName', params.lastName);
      expect(res.body).toHaveProperty('email', params.email);
      expect(res.body).toHaveProperty('company');
    });
    it('should send auth and refresh tokens in the response header if user created', async () => {
      const res = await exec();
      expect(res.headers).toHaveProperty('x-auth-token');
      expect(res.headers).toHaveProperty('x-refresh-token');
    });
    it('should send 400 response status if email is already taken', async () => {
      await exec(); // create user
      const res = await exec(); // create another user with same email as the first one
      expect(res.status).toBe(400);
      expect(res.text).toContain('email'); // email already taken
    })
  });

  describe('/login', () => {
    beforeAll(async () => { // create a user
      const data = {
        firstName: 'first', lastName: 'last', email: 'a@gmail.com', password: 'aze123'
      };
      await request(app).post('/api/users/signup').send(data);
    });
    afterAll(async () => {
      await global.Components.users.Model.deleteMany({});
      await global.Components.companies.Model.deleteMany({});
    });
    let body;
    const exec = () => request(app).get('/api/users/login').send(body);
    beforeEach(() => body = { email: 'a@gmail.com', password: 'aze123' });

    it('should send 404 status code if email is not correct', async () => {
      body.email = 'b@gmail.com'; // the correct email is: a@gmail.com
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.text).toContain('invalid email and/or password');
    });
    it('should send 400 status code if password is not correct', async () => {
      body.password = '123456'; // the correct password is: aze123
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.text).toContain('invalid email and/or password');
    });
    it('should send 200 status code if the user exists', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
    it('should send the user in the response body if the user exists', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('firstName', 'first');
      expect(res.body).toHaveProperty('lastName', 'last');
      expect(res.body).toHaveProperty('email', 'a@gmail.com');
    });
    it('should send auth and refresh tokens in the response header if the user exists', async () => {
      const res = await exec();
      expect(res.headers).toHaveProperty('x-auth-token');
      expect(res.headers).toHaveProperty('x-refresh-token');
    });
  });

  describe('/invite', () => {
    let admin;
    beforeEach(async () => {
      // create the user that will do the invite action
      // it can be any user tha has permission to invite another user
      // here we choosed to work with an admin
      const adminData = {
        firstName: 'admin', lastName: 'admin', email: 'a@gmail.com', password: 'aze123'
      };
      const res = await request(app).post('/api/users/signup').send(adminData);
      admin = res.body;
      admin.authToken = res.headers['x-auth-token'];
    });

    afterEach(async () => {
      await global.Components.users.Model.deleteMany({});
      await global.Components.companies.Model.deleteMany({});
    });

    const body = { 
      lastName: 'user', firstName: 'user', email: 'u@gmail.com', password: '123456' };
    const exec = () => {
      return request(app).post('/api/users/invite').set('x-auth-token', admin.authToken).send(body);
    }

    it('should create the user passed in req.body if user data are valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('firstName', body.firstName);
      expect(res.body).toHaveProperty('lastName', body.lastName);
      expect(res.body).toHaveProperty('email', body.email);
    })
  });
});
