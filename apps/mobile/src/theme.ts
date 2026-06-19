// Mobile-first design tokens for AlbTurf mobile app.
export const colors = {
  bg: "#0B1220",
  surface: "#111A2E",
  surfaceAlt: "#172238",
  border: "#1F2D4A",
  text: "#E6ECF7",
  textDim: "#9AA7C0",
  primary: "#3B82F6",
  primaryText: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#60A5FA",
};

export const radius = { sm: 6, md: 10, lg: 14, xl: 20 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export function stateColor(state: string): string {
  switch (state) {
    case "overdue":
      return colors.danger;
    case "due_soon":
      return colors.warning;
    case "ok":
      return colors.success;
    default:
      return colors.textDim;
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "blocked":
      return colors.danger;
    case "awaiting_external":
      return colors.warning;
    case "in_progress":
      return colors.info;
    case "completed":
      return colors.success;
    case "rejected":
      return colors.danger;
    default:
      return colors.textDim;
  }
}
