const db = Core.Model;

const schema = new db.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String, required: true,
        validate: {
            validator: (email) => { // check if an email is already taken
                return new Promise(async (resolve, reject) => {
                    const user = await Components.users.Model.findOne({ email });
                    if (user) reject(new Error('email already taken'));
                    else resolve();
                });
            }
        }
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    company: { type: db.Schema.Types.ObjectId, ref: 'company', required: true },
    role: { type: db.Schema.Types.ObjectId, ref: 'role' }
}, { timestamps: true });
// hash password in case of a sign up
schema.pre('save', async function (next) {
    if (this.isNew) this.password = await Utils.functions.hash(this.password);
    next();
});
// generate auth token
schema.methods.authToken = function () {
    const { jwt } = Utils, key = Utils.config.get('jwt.keys.authToken');
    const data = { userId: this._id, companyId: this.company };
    const token = jwt.sign(data, key, { expiresIn: 60 * 60 * 24 * 7  }); //! 7 days (in dev mode)
    return token;
}
// generate refresh token
schema.methods.refreshToken = function () {
    const { jwt } = Utils, threeDays = 3*24*60*60, key = Utils.config.get('jwt.keys.refreshToken');
    const token = jwt.sign({ userId: this._id }, key, { expiresIn: threeDays }); // ! 3 days is random 
    return token;
}
// to get both tokens
schema.methods.tokens = function () {
    return { 'x-auth-token': this.authToken(), 'x-refresh-token': this.refreshToken() };
}

module.exports = db.model('user', schema);
