const db = Core.Model;
const schema = new db.Schema({
  path: { type: String, required: true },
  label: { type: String, trim: true },
  website: { type: db.Schema.Types.ObjectId, ref: 'website', required: true },
  // make sure a user has only access to ressources that belong to his company
  company: { type: db.Schema.Types.ObjectId, ref: 'company', required: true },
  events: [String], // tracked events on this element
  creationDate: { type: Date, default: Date.now }
});
module.exports = db.model('element', schema);