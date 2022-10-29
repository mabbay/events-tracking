const db = Core.Model;

const schema = new db.Schema({
  domain: { type: String, required: true },
  company: { type: db.Schema.Types.ObjectId, ref: 'company', required: true }
});

module.exports = db.model('website', schema);