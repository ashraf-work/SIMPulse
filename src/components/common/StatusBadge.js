import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }) {
  return <Badge tone={status}>{status}</Badge>;
}
