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

// ─── Schemas ────────────────────────────────────────────────────────────────

const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema(
  { email: { type: String, unique: true }, passwordHash: String, name: String, role: String, sessions: Array },
  { timestamps: true }
));

const ServicePackage = mongoose.models.ServicePackage || mongoose.model("ServicePackage", new mongoose.Schema(
  { packageId: { type: String, unique: true }, name: String, dataLimit: String, price: Number },
  { timestamps: true }
));

const Sim = mongoose.models.Sim || mongoose.model("Sim", new mongoose.Schema(
  {
    simNumber: { type: String, unique: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage" },
    packageSnapshot: { packageId: String, name: String, dataLimit: String, price: Number },
    status: String,
  },
  { timestamps: true }
));

const ActivationRequest = mongoose.models.ActivationRequest || mongoose.model("ActivationRequest", new mongoose.Schema(
  {
    customerName: String,
    email: String,
    phone: String,
    simNumber: String,
    provider: String,
    requestId: { type: String, unique: true },
    status: String,
  },
  { timestamps: true }
));

const Setting = mongoose.models.Setting || mongoose.model("Setting", new mongoose.Schema(
  {
    singleton: { type: String, unique: true },
    businessName: String,
    supportEmail: String,
    autoActivation: Boolean,
    maintenanceMode: Boolean,
  },
  { timestamps: true }
));

// ─── Seed Data ───────────────────────────────────────────────────────────────

const servicePackages = [
  { packageId: "PKG-5GB",  name: "Starter Connect",     dataLimit: "5GB",       price: 14.99 },
  { packageId: "PKG-10GB", name: "Basic Data 10",        dataLimit: "10GB",      price: 19.99 },
  { packageId: "PKG-15GB", name: "Plus Data 15",         dataLimit: "15GB",      price: 24.99 },
  { packageId: "PKG-20GB", name: "Retail Data 20",       dataLimit: "20GB",      price: 29.99 },
  { packageId: "PKG-25GB", name: "Premium Data 25",      dataLimit: "25GB",      price: 39.99 },
  { packageId: "PKG-50GB", name: "Power Data 50",        dataLimit: "50GB",      price: 49.99 },
  { packageId: "PKG-UNL",  name: "Business Unlimited",   dataLimit: "Unlimited", price: 59.99 },
];

// 35 unique SIMs — each packageId used intentionally, no repeating simNumbers
const simSeeds = [
  { simNumber: "89441001", packageId: "PKG-5GB",  status: "available" },
  { simNumber: "89441002", packageId: "PKG-5GB",  status: "available" },
  { simNumber: "89441003", packageId: "PKG-5GB",  status: "available" },
  { simNumber: "89441004", packageId: "PKG-5GB",  status: "available" },
  { simNumber: "89441005", packageId: "PKG-5GB",  status: "available" },
  { simNumber: "89441006", packageId: "PKG-10GB", status: "available" },
  { simNumber: "89441007", packageId: "PKG-10GB", status: "available" },
  { simNumber: "89441008", packageId: "PKG-10GB", status: "available" },
  { simNumber: "89441009", packageId: "PKG-10GB", status: "available" },
  { simNumber: "89441010", packageId: "PKG-10GB", status: "available" },
  { simNumber: "89441011", packageId: "PKG-15GB", status: "available" },
  { simNumber: "89441012", packageId: "PKG-15GB", status: "available" },
  { simNumber: "89441013", packageId: "PKG-15GB", status: "available" },
  { simNumber: "89441014", packageId: "PKG-15GB", status: "available" },
  { simNumber: "89441015", packageId: "PKG-15GB", status: "available" },
  { simNumber: "89441016", packageId: "PKG-20GB", status: "available" },
  { simNumber: "89441017", packageId: "PKG-20GB", status: "available" },
  { simNumber: "89441018", packageId: "PKG-20GB", status: "available" },
  { simNumber: "89441019", packageId: "PKG-20GB", status: "available" },
  { simNumber: "89441020", packageId: "PKG-20GB", status: "available" },
  { simNumber: "89441021", packageId: "PKG-25GB", status: "available" },
  { simNumber: "89441022", packageId: "PKG-25GB", status: "available" },
  { simNumber: "89441023", packageId: "PKG-25GB", status: "available" },
  { simNumber: "89441024", packageId: "PKG-25GB", status: "available" },
  { simNumber: "89441025", packageId: "PKG-25GB", status: "available" },
  { simNumber: "89441026", packageId: "PKG-50GB", status: "available" },
  { simNumber: "89441027", packageId: "PKG-50GB", status: "available" },
  { simNumber: "89441028", packageId: "PKG-50GB", status: "available" },
  { simNumber: "89441029", packageId: "PKG-50GB", status: "available" },
  { simNumber: "89441030", packageId: "PKG-50GB", status: "available" },
  { simNumber: "89441031", packageId: "PKG-UNL",  status: "available" },
  { simNumber: "89441032", packageId: "PKG-UNL",  status: "available" },
  { simNumber: "89441033", packageId: "PKG-UNL",  status: "available" },
  { simNumber: "89441034", packageId: "PKG-UNL",  status: "available" },
  { simNumber: "89441035", packageId: "PKG-UNL",  status: "available" },
];

// Activation requests — simNumbers must exist in simSeeds above
// statuses: pending | approved | activated | rejected
const activationRequests = [
  {
    requestId: "REQ-10001",
    customerName: "Ali Hassan",
    email: "ali.hassan@example.com",
    phone: "+923011111111",
    simNumber: "89441001",
    provider: "T-Mobile",
    status: "pending",
  },
  {
    requestId: "REQ-10002",
    customerName: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    phone: "+923022222222",
    simNumber: "89441006",
    provider: "AT&T",
    status: "activated",
  },
  {
    requestId: "REQ-10003",
    customerName: "Hamza Noor",
    email: "hamza.noor@example.com",
    phone: "+923033333333",
    simNumber: "89441011",
    provider: "Verizon",
    status: "approved",
  },
  {
    requestId: "REQ-10004",
    customerName: "Fatima Malik",
    email: "fatima.malik@example.com",
    phone: "+923044444444",
    simNumber: "89441016",
    provider: "Vodafone",
    status: "pending",
  },
  {
    requestId: "REQ-10005",
    customerName: "Usman Tariq",
    email: "usman.tariq@example.com",
    phone: "+923055555555",
    simNumber: "89441021",
    provider: "O2",
    status: "rejected",
  },
  {
    requestId: "REQ-10006",
    customerName: "Ayesha Siddiqui",
    email: "ayesha.s@example.com",
    phone: "+923066666666",
    simNumber: "89441026",
    provider: "Orange",
    status: "activated",
  },
  {
    requestId: "REQ-10007",
    customerName: "Bilal Raza",
    email: "bilal.raza@example.com",
    phone: "+923077777777",
    simNumber: "89441031",
    provider: "T-Mobile",
    status: "pending",
  },
];

// ─── Seed Runner ─────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(uri);
  console.log("✔ MongoDB connected");

  // Drop all collections for a clean slate
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    await db.collection(col.name).drop();
    console.log(`  dropped → ${col.name}`);
  }
  console.log("✔ Database cleared");

  // Admin
  await Admin.create({
    email: "admin@simpulse.net",
    passwordHash: await bcrypt.hash("password123", 12),
    name: "SIMPulse Admin",
    role: "admin",
    sessions: [],
  });
  console.log("✔ Admin created  →  admin@simpulse.net / password123");

  // Service packages
  await ServicePackage.insertMany(servicePackages);
  console.log(`✔ ${servicePackages.length} service packages created`);

  // SIMs — resolve packageId → ObjectId
  const pkgDocs = await ServicePackage.find({});
  const pkgMap = new Map(pkgDocs.map((p) => [p.packageId, p]));

  const simDocs = simSeeds.map((s) => {
    const pkg = pkgMap.get(s.packageId);
    if (!pkg) throw new Error(`Unknown packageId: ${s.packageId}`);
    return {
      simNumber: s.simNumber,
      status: s.status,
      package: pkg._id,
      packageSnapshot: {
        packageId: pkg.packageId,
        name: pkg.name,
        dataLimit: pkg.dataLimit,
        price: pkg.price,
      },
    };
  });

  await Sim.insertMany(simDocs);
  console.log(`✔ ${simDocs.length} SIMs created`);

  // Activation requests
  await ActivationRequest.insertMany(activationRequests);
  console.log(`✔ ${activationRequests.length} activation requests created`);

  // Settings
  await Setting.create({
    singleton: "global",
    businessName: "SIMPulse",
    supportEmail: "support@simpulse.net",
    autoActivation: false,
    maintenanceMode: false,
  });
  console.log("✔ Settings created");

  console.log("\n✅ Seed complete");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("✖ Seed failed:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});