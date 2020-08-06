const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
const opts = {
    useNewUrlParser: true,
    useCreateIndex: true, // analyze this
    useUnifiedTopology: true,
};

const password = 'arfarfbarkbark';
const validUserData = {
    username: 'koto-the-dog',
    password: password,
};

module.exports.password = password;
module.exports.validUserData = validUserData;

module.exports.setupDatabase = async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
};

// Taking 'testing node.js + mongoose with an in-memory database'
module.exports.cleanupDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

module.exports.deleteDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};


