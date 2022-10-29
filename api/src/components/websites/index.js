module.exports = class Controller extends Core.Controller {
    constructor() {
        super('websites');
    }
    async delete(req) {
        //whenever we delete a website all of its elements should be gone too
        const result = await new Core.Controller('elements').deleteMany({ filters: { website: req.id } });
        if (result) {
            return super.delete(req);
        }
    }
}