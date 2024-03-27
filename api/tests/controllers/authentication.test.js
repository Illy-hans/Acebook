const app = require("../../app");
const supertest = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");
const bcrypt = require('bcrypt');

jest.mock('bcrypt'); // mock to bcrypt

describe('Test success in createToken from AuthenticationController', () => {
  
    afterAll(async () => {
    await User.deleteMany({});
  }); 
  

  
  test("email dont exist", async () => {
    const hashedPassword = await bcrypt.hash('12345678', 10); //create encypt password
    const user = { 
      email: 'auth-test@test.com', 
      password: hashedPassword 
    };
    User.findOne = jest.fn().mockResolvedValue(null); // return funtion findOne mocked and assume user email doesn't exist
    const response = await supertest(app)
      .post('/tokens')
      .send({ email: 'non-existent@test.com', password: '12345678' });
    expect(response.status).toBe(401);
    expect(response.body.token).toBeUndefined();
    expect(response.body.message).toBe('User not found');
    });
    
    test('if valid password, create token', async () => {
      const hashedPassword = await bcrypt.hash('12345678', 10); //create encypt password
      const user = { 
        email: 'auth-test@test.com', 
        password: hashedPassword 
      };
      User.findOne = jest.fn().mockResolvedValue(user); // return funtion findOne mocked and assume use exist
      bcrypt.compare.mockResolvedValue(true); // funtion compare mocked and assume password sended is same in DB
      const response = await supertest(app)
        .post('/tokens')
        .send({ email: 'auth-test@test.com', password: '12345678' });
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toBe('OK');
    });
    

  
    test('if not valid password, dont create token', async () => {
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const user = { 
        email: 'auth-test@test.com', 
        password: hashedPassword
      };
      User.findOne = jest.fn().mockResolvedValue(user); // return funtion findOne mocked and assume use exist
      bcrypt.compare.mockResolvedValue(false); // funtion compare mocked and assume password sended is not same in DB
      const response = await supertest(app)
        .post('/tokens')
        .send({ email: 'auth-test@test.com', password: 'wrongpassword' });
      expect(response.status).toBe(401);
      expect(response.body.token).toBeUndefined();
      expect(response.body.message).toBe('Password incorrect');
    });

});