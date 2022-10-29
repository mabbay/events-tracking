const db = Core.Model;
const schema = new db.Schema({
  pagePath: { type: String },
  views: { type: Number, default: 1 }, // number of views
  date: { type: Date, default: Date.now },
  website: { type: db.Schema.Types.ObjectId, ref: 'website', required: true },
  company: { type: db.Schema.Types.ObjectId, ref: 'company', required: true }
});
module.exports = db.model('pageView', schema);