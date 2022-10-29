module.exports = class Schema extends Core.Schema{
    constructor(){
        super();
        this.actions = {
            get : ['auth', 'authorize'],
            search : ['auth', 'authorize'],
            create : ['auth', 'authorize'],
            // update : [],
            // delete : []
        }
    }
}