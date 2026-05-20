import mongoose from "mongoose";

const ActivationRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    simNumber: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    requestId: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "activated", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.models.ActivationRequest ||
  mongoose.model("ActivationRequest", ActivationRequestSchema);
