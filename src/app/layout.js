import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SIMPulse Admin",
  description: "SIM activation admin operations panel"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
