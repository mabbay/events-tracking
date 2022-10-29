// authorization
module.exports = async function (req) {
    // get the user from DB
    const filters = { _id: req.session.user._id }, options = { populate: 'role' };
    let response = await (new Core.Controller('users')).get({ filters, options });
    // something went wrong (user not found for example) 
    if (response.getStatus() != 200) return response;
    const { content: user } = response; req.session.user = user;
    let { module, action } = req.params; action = convertAction(action);
    // check for permission
    if (user.isAdmin !== true) { // not an admin
        if (!user.role) return new Response('Forbidden (lack of permissions)', 403);
        const permission = user.role.permissions.find(p => {
            return p.module === module && p.access[action] === true
        });
        if (!permission) return new Response('Forbidden (lack of permission)', 403);
    } // current user has access or he is the admin

    applyGeneralRestrictions(req, action);

    // to apply special restrictions
    const middleware = Middlewares.modules[module];
    if (!middleware) return new Response();
    return middleware(req);
}

// make sure a user has only access to ressources that belong to his company
function applyGeneralRestrictions(req, access) {
    const { user } = req.session;
    if (access === 'create') req.body.company = user.company.toString();
    else req.filters.company = user.company;
}

// convert action to an access (one of this: ['read', 'create', 'update', 'delete'])
function convertAction(action) {
    if (action === 'get' || action === 'search') return 'read';
    else if (action === 'invite') return 'create';
    return action;
}


