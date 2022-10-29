
module.exports = async function (req) {
    const token = req.headers['x-auth-token'];
    const key = Utils.config.get('jwt.keys.authToken');
    if (!key) return new Response('Forbidden', 403);
    if (!token) return new Response('Access denied.', 401);
    try {
        const decoded = Utils.jwt.verify(token, key);
        req.session = {
            user: { _id: decoded.userId, company: decoded.companyId }
        }
        return new Response();
    } catch (ex) {
        return new Response('Invalid token', 400);
    }
}