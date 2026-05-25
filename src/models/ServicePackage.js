import mongoose from "mongoose";

const ServicePackageSchema = new mongoose.Schema(
  {
    carrierName: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

ServicePackageSchema.index({ name: "text", carrierName: "text" });

if (process.env.NODE_ENV !== "production" && mongoose.models.ServicePackage) {
  mongoose.deleteModel("ServicePackage");
}

export default mongoose.models.ServicePackage ||
  mongoose.model("ServicePackage", ServicePackageSchema);
