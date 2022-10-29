const db = Core.Model;

const permissionSchema = new db.Schema({
  module: { type: String, required: true },
  access: {
    read:   { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  }
});

const roleSchema = new db.Schema({
  name: { type: String, required: true },
  description: String,
  permissions: [ permissionSchema ],
  company: { type: db.Schema.Types.ObjectId, ref: 'company' }
}, { timestamps: true });

module.exports = db.model('role', roleSchema);