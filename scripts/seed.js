const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

function loadEnv() {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadEnv();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sim_activation_system";

const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  name: String,
  role: String,
  sessions: Array
}, { timestamps: true }));

const Sim = mongoose.models.Sim || mongoose.model("Sim", new mongoose.Schema({
  simNumber: { type: String, unique: true },
  networkChannel: String,
  assignedScheme: String,
  status: String
}, { timestamps: true }));

const ServicePackage = mongoose.models.ServicePackage || mongoose.model("ServicePackage", new mongoose.Schema({
  packageId: { type: String, unique: true },
  name: String,
  dataLimit: String,
  price: Number
}, { timestamps: true }));

const ActivationRequest = mongoose.models.ActivationRequest || mongoose.model("ActivationRequest", new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  simNumber: String,
  provider: String,
  requestId: { type: String, unique: true },
  status: String
}, { timestamps: true }));

const Setting = mongoose.models.Setting || mongoose.model("Setting", new mongoose.Schema({
  singleton: { type: String, unique: true },
  businessName: String,
  supportEmail: String,
  autoActivation: Boolean,
  maintenanceMode: Boolean
}, { timestamps: true }));

async function seed() {
  await mongoose.connect(uri);

  await Admin.findOneAndUpdate(
    { email: "admin@simpulse.net" },
    {
      email: "admin@simpulse.net",
      passwordHash: await bcrypt.hash("password123", 12),
      name: "SIMPulse Admin",
      role: "admin",
      sessions: []
    },
    { upsert: true, returnDocument: "after" }
  );

  await Sim.bulkWrite([
    { updateOne: { filter: { simNumber: "SIM-78451290" }, update: { $set: { networkChannel: "T-Mobile", assignedScheme: "Retail 20GB", status: "available" } }, upsert: true } },
    { updateOne: { filter: { simNumber: "SIM-78451291" }, update: { $set: { networkChannel: "AT&T", assignedScheme: "Business Unlimited", status: "activated" } }, upsert: true } },
    { updateOne: { filter: { simNumber: "SIM-78451292" }, update: { $set: { networkChannel: "Verizon", assignedScheme: "Starter 5GB", status: "available" } }, upsert: true } }
  ]);

  await ServicePackage.bulkWrite([
    { updateOne: { filter: { packageId: "PKG-20GB" }, update: { $set: { name: "Retail Data 20", dataLimit: "20GB", price: 29.99 } }, upsert: true } },
    { updateOne: { filter: { packageId: "PKG-UNL" }, update: { $set: { name: "Business Unlimited", dataLimit: "Unlimited", price: 59.99 } }, upsert: true } },
    { updateOne: { filter: { packageId: "PKG-5GB" }, update: { $set: { name: "Starter Connect", dataLimit: "5GB", price: 14.99 } }, upsert: true } }
  ]);

  await ActivationRequest.bulkWrite([
    { updateOne: { filter: { requestId: "REQ-10021" }, update: { $set: { customerName: "Ali Khan", email: "ali@example.com", phone: "+923001111111", simNumber: "SIM-78451290", provider: "T-Mobile", status: "pending" } }, upsert: true } },
    { updateOne: { filter: { requestId: "REQ-10022" }, update: { $set: { customerName: "Sara Ahmed", email: "sara@example.com", phone: "+923002222222", simNumber: "SIM-78451291", provider: "AT&T", status: "activated" } }, upsert: true } },
    { updateOne: { filter: { requestId: "REQ-10023" }, update: { $set: { customerName: "Hamza Noor", email: "hamza@example.com", phone: "+923003333333", simNumber: "SIM-78451292", provider: "Verizon", status: "approved" } }, upsert: true } }
  ]);

  await Setting.findOneAndUpdate(
    { singleton: "global" },
    { businessName: "SIMPulse", supportEmail: "support@simpulse.net", autoActivation: false, maintenanceMode: false },
    { upsert: true }
  );

  console.log("Seed completed. Admin: admin@simpulse.net / password123");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
