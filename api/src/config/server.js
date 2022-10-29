const db = require('./db');
const logger = Utils.logger;
const { PORT } = Utils.constants;
exports.start = function (app) {
    db.start();
    console.log(`http://localhost:${PORT}`);
    return app.listen(PORT);
}
//! app must be the result of express_app.listen(port)
exports.close = async function (app) {
    app.close();  
    await db.close();
    return logger(`Server stopped listening at port [${PORT}]`);
}