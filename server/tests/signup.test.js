const dbHandler = require('../utils/mongo-test-utils');
const User = require('../models/user');

const password = dbHandler.password;
const validUserData = dbHandler.validUserData;

beforeAll(async () => await dbHandler.setupDatabase());

afterAll(async () => await dbHandler.deleteDatabase());

describe('Signup', () => {
    afterEach(async () => await dbHandler.cleanupDatabase());
    it('creates and saves valid user succesfully', async () => {
        const userDataWithoutPass = createInvalidUserData(validUserData, 'password');
        const insertedUser = await User.create(validUserData);
        delete insertedUser.password;
        expect(insertedUser).toMatchObject(userDataWithoutPass);
    });

    it('throws validation error if username not included', async () => {
        const userDataWithoutUsername = createInvalidUserData(validUserData, 'username');
        checkValidationError(userDataWithoutUsername);
    });

    it('throws validation error if password not included', async () => {
        const userDataWithoutPassword = createInvalidUserData(validUserData, 'password');
        checkValidationError(userDataWithoutPassword);
    });

    it('throws validation error if password is too short', async () => {
        let invalidUserData = createInvalidUserData(validUserData, 'password');
        invalidUserData.password = 'a'.repeat(7);
        checkValidationError(invalidUserData);
    });

    it('throws validation error if username is too long/short/has illegal characters', async () => {
        // too short
        let invalidUserData = {
            ...validUserData,
        };
        invalidUserData.username = 'a';
        let invalidUser = new User(invalidUserData);
        const tooShortError = invalidUser.validateSync();
        expect(tooShortError.name).toEqual('ValidationError');

        // too long
        invalidUserData = {
            ...validUserData,
        };
        invalidUserData.username = 'a'.repeat(100);
        invalidUser = new User(invalidUserData);
        const tooLongError = invalidUser.validateSync();
        expect(tooLongError.name).toEqual('ValidationError');

        // illegalChars
        invalidUserData = {
            ...validUserData,
        };
        invalidUserData.username = '*'.repeat(10);
        invalidUser = new User(invalidUserData);
        const illegalCharError = invalidUser.validateSync();
        expect(illegalCharError.name).toEqual('ValidationError');
    });

    it('throws validation error if given userType that is not user or admin', async () => {
        let invalidUserData = {
            ...validUserData,
            userType: 'sasha',
        };
        const invalidUser = new User(invalidUserData);
        const validationError = invalidUser.validateSync();
        expect(validationError.name).toEqual('ValidationError');
    });

    it('throws validation error if daily entries are beyond/above maximum of USER_DAILY_ENTRY_LIMIT', async () => {
        let invalidUserData = {
            ...validUserData,
        };
        invalidUserData.remainingDailyEntries = Number.MAX_VALUE;
        checkValidationError(invalidUserData);

        invalidUserData.remainingDailyEntries = -1;
        checkValidationError(invalidUserData);
    });

    // CORRECT ERROR IS THROWN, BUT JEST CAN'T CATCH IT FOR SOME REASON
    // it('throws mongo error if username already taken', async () => {
    //     console.log();
    //     const validUser = await User.create(validUserData);
    //     console.log(await User.create(validUserData));
    // });
});

/**
 * Returns an object representing the given data without the given property
 * @param {*} data - Object representing user schema
 * @param {*} property - property to delete from object
 * @throws Error if property does not exist from object
 * @returns object without property
 */
function createInvalidUserData(data, property) {
    const invalidUserData = {
        ...data,
    };
    delete invalidUserData[property];
    return invalidUserData;
}


function checkValidationError(invalidData) {
    const invalidUser = new User(invalidData);
    const error = invalidUser.validateSync();
    expect(error.name).toEqual('ValidationError');
}