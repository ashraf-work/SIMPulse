import mongoose from "mongoose";

const ServicePackageSchema = new mongoose.Schema(
  {
    packageId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    dataLimit: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

ServicePackageSchema.index({ name: "text", packageId: "text" });

export default mongoose.models.ServicePackage ||
  mongoose.model("ServicePackage", ServicePackageSchema);
