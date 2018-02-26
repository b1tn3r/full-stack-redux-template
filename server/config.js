const env = process.env;

module.exports.nodeEnv = env.NODE_ENV || 'development';
module.exports = {
    mongodbUri: 'mongodb://localhost:27017',
    port: env.PORT || 3000,
    host: env.HOST || '127.0.0.1',
    get serverUrl() {
        return `http://${this.host}:${this.port}`;
    }
};