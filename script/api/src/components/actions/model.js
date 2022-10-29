const db = Core.Model;
const schema = new db.Schema({
    element: { type: db.Schema.Types.ObjectId, ref: 'element' },
    company: { type: db.Schema.Types.ObjectId, ref: 'company' },    
    event: { type: String, required: true },
    frequency: { type: Number, default: 0 },
    page: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isSpam: { type: Boolean, default: false }
});
module.exports = db.model('action', schema);