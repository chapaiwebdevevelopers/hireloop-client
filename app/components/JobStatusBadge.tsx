import { Badge } from "@/components/ui/badge";
import {
  activeStatusBadgeClass,
  expiredStatusBadgeClass,
} from "@/lib/styles";
import { TJobStatus } from "@/types/types";

/** Colored pill for a job posting status — reusable in tables & cards */
export function JobStatusBadge({ status }: { status: TJobStatus }) {
  return (
    <Badge
      variant="secondary"
      className={
        status === "Active" ? activeStatusBadgeClass : expiredStatusBadgeClass
      }
    >
      {status}
    </Badge>
  );
}
