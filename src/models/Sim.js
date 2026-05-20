import mongoose from "mongoose";

const SimSchema = new mongoose.Schema(
  {
    simNumber: { type: String, required: true, unique: true, trim: true },
    networkChannel: { type: String, required: true, trim: true },
    assignedScheme: { type: String, required: true, trim: true },
    status: { type: String, enum: ["available", "activated"], default: "available" }
  },
  { timestamps: true }
);

export default mongoose.models.Sim || mongoose.model("Sim", SimSchema);
