import mongoose from "mongoose";

const ActivationRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    simNumber: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    carrierSnapshot: {
      carrierName: { type: String, trim: true },
      packageName: { type: String, trim: true },
      price: { type: Number, min: 0 }
    },
    requestId: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "activated", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

ActivationRequestSchema.index({ status: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.ActivationRequest) {
  mongoose.deleteModel("ActivationRequest");
}

export default mongoose.models.ActivationRequest ||
  mongoose.model("ActivationRequest", ActivationRequestSchema);
