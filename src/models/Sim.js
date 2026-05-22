import mongoose from "mongoose";

const SimSchema = new mongoose.Schema(
  {
    simNumber: { type: String, required: true, unique: true, trim: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage", required: true },
    packageSnapshot: {
      packageId: { type: String, required: true },
      name: { type: String, required: true },
      dataLimit: { type: String, required: true },
      price: { type: Number, required: true }
    },
    status: { type: String, enum: ["available", "activated"], default: "available" }
  },
  { timestamps: true }
);

SimSchema.index({ status: 1 });
SimSchema.index({ "packageSnapshot.packageId": 1 });

export default mongoose.models.Sim || mongoose.model("Sim", SimSchema);
