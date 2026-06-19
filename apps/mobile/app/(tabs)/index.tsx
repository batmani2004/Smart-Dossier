import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { api, type Dashboard } from "../../src/api";
import { Badge, Body, Card, EmptyState, ErrorState, H1, H2, Loading, Muted } from "../../src/ui";
import { colors, spacing, stateColor } from "../../src/theme";
import { DEADLINE_STATE_SQ } from "../../src/labels";

export default function HomeScreen() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const d = await api.dashboard();
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "E panjohur");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Loading label="Po ngarkohet paneli…" />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); void load(); }} />;
  if (!data) return <EmptyState title="Pa të dhëna" />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load();
          }}
          tintColor={colors.primary}
        />
      }
      data={data.recent}
      keyExtractor={(d) => d.id}
      ListHeaderComponent={
        <View>
          <H1>Përshëndetje 👋</H1>
          <Muted>Përmbledhje e dosjeve aktive</Muted>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
            <Stat label="Aktive" value={data.totals.active} color={colors.info} />
            <Stat label="Bllokuar" value={data.totals.blocked} color={colors.danger} />
            <Stat label="Gjithsej" value={data.totals.dossiers} color={colors.primary} />
          </View>

          {data.criticalAlerts.length > 0 && (
            <Card style={{ borderColor: colors.danger, marginTop: spacing.lg }}>
              <H2>🚨 Sinjalizime kritike ({data.criticalAlerts.length})</H2>
              {data.criticalAlerts.slice(0, 3).map((a, i) => (
                <View key={i} style={{ marginTop: spacing.sm }}>
                  <Body style={{ fontWeight: "600" }}>{a.label}</Body>
                  <Muted>{a.trackingCode} — {a.title}</Muted>
                </View>
              ))}
            </Card>
          )}

          {data.expiringDeadlines.length > 0 && (
            <Card style={{ marginTop: spacing.md }}>
              <H2>⏱ Afate</H2>
              {data.expiringDeadlines.slice(0, 4).map((d, i) => (
                <View key={i} style={{ marginTop: spacing.sm, flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Body>{d.label}</Body>
                    <Muted>{d.trackingCode}</Muted>
                  </View>
                  <Badge label={DEADLINE_STATE_SQ[d.state] ?? d.state} color={stateColor(d.state)} />
                </View>
              ))}
            </Card>
          )}

          <H2>Dosje së fundmi</H2>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/dossier/${item.id}`)} activeOpacity={0.7}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Body style={{ fontWeight: "700", flex: 1 }}>{item.title}</Body>
              <Badge label={item.processTitle} color={colors.primary} />
            </View>
            <Muted>{item.trackingCode} • {item.phaseTitle}</Muted>
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
              <Badge label={DEADLINE_STATE_SQ[item.deadlineState] ?? item.deadlineState} color={stateColor(item.deadlineState)} />
              {item.criticalAlertCount > 0 && (
                <Badge label={`${item.criticalAlertCount} kritik`} color={colors.danger} />
              )}
            </View>
          </Card>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<EmptyState title="Pa dosje" />}
    />
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card style={{ flex: 1, alignItems: "center", marginBottom: 0 }}>
      <Body style={{ color, fontSize: 24, fontWeight: "800" }}>{value}</Body>
      <Muted>{label}</Muted>
    </Card>
  );
}
