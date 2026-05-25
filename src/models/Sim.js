import mongoose from "mongoose";

const SimSchema = new mongoose.Schema(
  {
    simNumber: { type: String, required: true, unique: true, trim: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage", required: true },
    packageSnapshot: {
      carrierName: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true }
    },
    status: { type: String, enum: ["available", "activated"], default: "available" }
  },
  { timestamps: true }
);

SimSchema.index({ status: 1 });
SimSchema.index({ package: 1 });
SimSchema.index({ "packageSnapshot.carrierName": 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Sim) {
  mongoose.deleteModel("Sim");
}

export default mongoose.models.Sim || mongoose.model("Sim", SimSchema);
