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
  { carrierName: { type: String, unique: true }, name: String, price: Number },
  { timestamps: true }
));

const Sim = mongoose.models.Sim || mongoose.model("Sim", new mongoose.Schema(
  {
    simNumber: { type: String, unique: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage" },
    packageSnapshot: { carrierName: String, name: String, price: Number },
    status: String,
  },
  { timestamps: true }
));

const ActivationRequest = mongoose.models.ActivationRequest || mongoose.model("ActivationRequest", new mongoose.Schema(
  {
    customerName: String,
    email: String,
    phone: String,
    address: String,
    simNumber: String,
    provider: String,
    carrierSnapshot: { carrierName: String, packageName: String, price: Number },
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
  { carrierName: "T-Mobile", name: "Starter Connect", price: 14.99 },
  { carrierName: "AT&T", name: "Basic Data 10", price: 19.99 },
  { carrierName: "Verizon", name: "Plus Data 15", price: 24.99 },
  { carrierName: "Vodafone", name: "Retail Data 20", price: 29.99 },
  { carrierName: "O2", name: "Premium Data 25", price: 39.99 },
  { carrierName: "Orange", name: "Power Data 50", price: 49.99 },
  { carrierName: "SIMPulse Global", name: "Business Unlimited", price: 59.99 },
];

// 35 unique SIMs - each carrier is used intentionally, no repeating simNumbers
const simSeeds = [
  { simNumber: "89441001", carrierName: "T-Mobile", status: "available" },
  { simNumber: "89441002", carrierName: "T-Mobile", status: "available" },
  { simNumber: "89441003", carrierName: "T-Mobile", status: "available" },
  { simNumber: "89441004", carrierName: "T-Mobile", status: "available" },
  { simNumber: "89441005", carrierName: "T-Mobile", status: "available" },
  { simNumber: "89441006", carrierName: "AT&T", status: "available" },
  { simNumber: "89441007", carrierName: "AT&T", status: "available" },
  { simNumber: "89441008", carrierName: "AT&T", status: "available" },
  { simNumber: "89441009", carrierName: "AT&T", status: "available" },
  { simNumber: "89441010", carrierName: "AT&T", status: "available" },
  { simNumber: "89441011", carrierName: "Verizon", status: "available" },
  { simNumber: "89441012", carrierName: "Verizon", status: "available" },
  { simNumber: "89441013", carrierName: "Verizon", status: "available" },
  { simNumber: "89441014", carrierName: "Verizon", status: "available" },
  { simNumber: "89441015", carrierName: "Verizon", status: "available" },
  { simNumber: "89441016", carrierName: "Vodafone", status: "available" },
  { simNumber: "89441017", carrierName: "Vodafone", status: "available" },
  { simNumber: "89441018", carrierName: "Vodafone", status: "available" },
  { simNumber: "89441019", carrierName: "Vodafone", status: "available" },
  { simNumber: "89441020", carrierName: "Vodafone", status: "available" },
  { simNumber: "89441021", carrierName: "O2", status: "available" },
  { simNumber: "89441022", carrierName: "O2", status: "available" },
  { simNumber: "89441023", carrierName: "O2", status: "available" },
  { simNumber: "89441024", carrierName: "O2", status: "available" },
  { simNumber: "89441025", carrierName: "O2", status: "available" },
  { simNumber: "89441026", carrierName: "Orange", status: "available" },
  { simNumber: "89441027", carrierName: "Orange", status: "available" },
  { simNumber: "89441028", carrierName: "Orange", status: "available" },
  { simNumber: "89441029", carrierName: "Orange", status: "available" },
  { simNumber: "89441030", carrierName: "Orange", status: "available" },
  { simNumber: "89441031", carrierName: "SIMPulse Global", status: "available" },
  { simNumber: "89441032", carrierName: "SIMPulse Global", status: "available" },
  { simNumber: "89441033", carrierName: "SIMPulse Global", status: "available" },
  { simNumber: "89441034", carrierName: "SIMPulse Global", status: "available" },
  { simNumber: "89441035", carrierName: "SIMPulse Global", status: "available" },
];

// Activation requests — simNumbers must exist in simSeeds above
// statuses: pending | approved | activated | rejected
const activationRequests = [
  {
    requestId: "REQ-10001",
    customerName: "Ali Hassan",
    email: "ali.hassan@example.com",
    phone: "+923011111111",
    address: "12 Main Boulevard, Lahore",
    simNumber: "89441001",
    provider: "T-Mobile",
    carrierName: "T-Mobile",
    status: "pending",
  },
  {
    requestId: "REQ-10002",
    customerName: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    phone: "+923022222222",
    address: "44 Jinnah Avenue, Islamabad",
    simNumber: "89441006",
    provider: "AT&T",
    carrierName: "AT&T",
    status: "activated",
  },
  {
    requestId: "REQ-10003",
    customerName: "Hamza Noor",
    email: "hamza.noor@example.com",
    phone: "+923033333333",
    address: "81 Clifton Block 5, Karachi",
    simNumber: "89441011",
    provider: "Verizon",
    carrierName: "Verizon",
    status: "approved",
  },
  {
    requestId: "REQ-10004",
    customerName: "Fatima Malik",
    email: "fatima.malik@example.com",
    phone: "+923044444444",
    address: "23 Model Town, Lahore",
    simNumber: "89441016",
    provider: "Vodafone",
    carrierName: "Vodafone",
    status: "pending",
  },
  {
    requestId: "REQ-10005",
    customerName: "Usman Tariq",
    email: "usman.tariq@example.com",
    phone: "+923055555555",
    address: "9 University Road, Peshawar",
    simNumber: "89441021",
    provider: "O2",
    carrierName: "O2",
    status: "rejected",
  },
  {
    requestId: "REQ-10006",
    customerName: "Ayesha Siddiqui",
    email: "ayesha.s@example.com",
    phone: "+923066666666",
    address: "17 Gulberg Greens, Islamabad",
    simNumber: "89441026",
    provider: "Orange",
    carrierName: "Orange",
    status: "activated",
  },
  {
    requestId: "REQ-10007",
    customerName: "Bilal Raza",
    email: "bilal.raza@example.com",
    phone: "+923077777777",
    address: "55 DHA Phase 6, Karachi",
    simNumber: "89441031",
    provider: "T-Mobile",
    carrierName: "SIMPulse Global",
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

  // SIMs - resolve carrierName to ObjectId
  const pkgDocs = await ServicePackage.find({});
  const pkgMap = new Map(pkgDocs.map((p) => [p.carrierName, p]));

  const simDocs = simSeeds.map((s) => {
    const pkg = pkgMap.get(s.carrierName);
    if (!pkg) throw new Error(`Unknown carrierName: ${s.carrierName}`);
    return {
      simNumber: s.simNumber,
      status: s.status,
      package: pkg._id,
      packageSnapshot: {
        carrierName: pkg.carrierName,
        name: pkg.name,
        price: pkg.price,
      },
    };
  });

  await Sim.insertMany(simDocs);
  console.log(`✔ ${simDocs.length} SIMs created`);

  // Activation requests
  const requestDocs = activationRequests.map((request) => {
    const carrier = pkgMap.get(request.carrierName);
    return {
      ...request,
      carrierSnapshot: carrier
        ? {
            carrierName: carrier.carrierName,
            packageName: carrier.name,
            price: carrier.price,
          }
        : undefined,
    };
  });
  await ActivationRequest.insertMany(requestDocs);
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
