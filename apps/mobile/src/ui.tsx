import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { colors, radius, spacing } from "./theme";

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={s.screen}>{children}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <Text style={s.h1}>{children}</Text>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <Text style={s.h2}>{children}</Text>;
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <Text style={s.muted}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.body, style]}>{children}</Text>;
}

export function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <View style={[s.badge, { backgroundColor: color + "22", borderColor: color }]}>
      <Text style={{ color, fontWeight: "600", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function Loading({ label }: { label?: string }) {
  return (
    <View style={s.loading}>
      <ActivityIndicator color={colors.primary} />
      {label ? <Text style={s.muted}>{label}</Text> : null}
    </View>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={s.empty}>
      <Text style={s.h2}>{title}</Text>
      {hint ? <Text style={s.muted}>{hint}</Text> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={s.empty}>
      <Text style={[s.h2, { color: colors.danger }]}>Gabim</Text>
      <Text style={s.muted}>{message}</Text>
      {onRetry ? (
        <Text onPress={onRetry} style={s.link}>
          Provo përsëri
        </Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  h1: { color: colors.text, fontSize: 22, fontWeight: "700", marginBottom: spacing.sm },
  h2: { color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: spacing.xs },
  body: { color: colors.text, fontSize: 14, lineHeight: 20 },
  muted: { color: colors.textDim, fontSize: 13, marginTop: spacing.xs },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  loading: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  empty: { padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  link: { color: colors.primary, marginTop: spacing.md, fontWeight: "600" },
});
