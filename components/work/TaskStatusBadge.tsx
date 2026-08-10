import { Badge } from "@/components/ui/badge";

const labels = {
	TODO: "To do",
	IN_PROGRESS: "In progress",
	DONE: "Done",
};

export const TaskStatusBadge = ({ status }: { status: keyof typeof labels }) => (
	<Badge variant={status === "DONE" ? "success" : status === "IN_PROGRESS" ? "default" : "secondary"}>
		{labels[status]}
	</Badge>
);
