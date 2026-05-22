import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function createContactMessage(payload) {
  await connectDB();
  const message = await ContactMessage.create(payload);
  return {
    _id: String(message._id),
    subject: message.subject,
    email: message.email,
    status: message.status,
    createdAt: message.createdAt
  };
}
