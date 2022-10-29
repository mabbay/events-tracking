const db = require('mongoose');
const logger = Utils.logger;
module.exports.start = function () {
    db.connect(Utils.config.get('db.host'), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, }).then(() => {
    }).catch(err => {
        logger(`Error database : ${err}`);
        process.exit(1);
    });
}
module.exports.close = async function () {
    try {
        await db.disconnect();
    } catch (error) {
        return logger(`${error}`);
    }
}