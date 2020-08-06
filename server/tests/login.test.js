const request = require('supertest');
const app = require('../index');
const dbHandler = require('../utils/mongo-test-utils');
const User = require('../models/user');

beforeAll(async () => {
    await dbHandler.setupDatabase();
    await User.create(dbHandler.validUserData);
});

afterAll(async () => {
    await dbHandler.deleteDatabase();
});

describe('Login', () => {
    it('Logs in user with correct credentials', async () => {
        request(app)
            .get('/auth/login')
            .send(dbHandler.validUserData)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.token.toMatch(new RegExp('^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$')));
            });
    });

    it('Fails to log in user with incorrect credentials', async () => {
        const invalidUserData = {
            username: dbHandler.validUserData.username,
            password: 'arfarf',
        };
        request(app)
            .get('/auth/login')
            .send(invalidUserData)
            .then((response) => {
                expect(response.statusCode(401));
                expect(response.message.toBe('The username and/or passwored given is invalid.'));
            });
    });

    it('Fails to log in user who does not exist', async () => {
        const invalidUserData = {
            username: 'idontexist',
            password: 'atlasthedog',
        };
        request(app)
            .get('/auth/login')
            .send(invalidUserData)
            .then((response) => {
                expect(response.statusCode(401));
                expect(response.message.toBe('The username and/or password given is invalid.'));
            });
    });

    // TODO: test that logged-in user can access protected routes
    // it('sends unauthorized if un-logged in user tries to access protected routes', async () => {
    //     request(app)
    //         .get('/user/')
    // });
});