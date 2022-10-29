const db = Core.Model;
const schema = new db.Schema({
  name: {
    type: String, required: true
  }
});
module.exports = db.model('company', schema);