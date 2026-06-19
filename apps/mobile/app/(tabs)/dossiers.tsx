import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { api, type DossierSummary } from "../../src/api";
import { Badge, Body, Card, EmptyState, ErrorState, H1, Loading, Muted } from "../../src/ui";
import { colors, radius, spacing, stateColor, statusColor } from "../../src/theme";
import { DEADLINE_STATE_SQ, PROCESS_LABEL_SQ, STATUS_LABEL_SQ } from "../../src/labels";

const PROCESS_FILTERS = ["", "ekb_privatization", "expropriation"] as const;
const STATUS_FILTERS = ["", "in_progress", "blocked", "awaiting_external", "completed"] as const;

export default function DossiersScreen() {
  const [items, setItems] = useState<DossierSummary[]>([]);
  const [search, setSearch] = useState("");
  const [proc, setProc] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const d = await api.listDossiers({ process: proc || undefined, status: status || undefined, search: search || undefined });
      setItems(d.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "E panjohur");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [proc, status, search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <H1>Dosjet</H1>
        <TextInput
          placeholder="Kërko (kod, titull, qytetar)…"
          placeholderTextColor={colors.textDim}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => void load()}
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
          {PROCESS_FILTERS.map((p) => (
            <Pill key={p || "all-p"} active={proc === p} label={p ? PROCESS_LABEL_SQ[p] : "Të gjitha"} onPress={() => setProc(p)} />
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
          {STATUS_FILTERS.map((p) => (
            <Pill key={p || "all-s"} active={status === p} label={p ? STATUS_LABEL_SQ[p] : "Çdo status"} onPress={() => setStatus(p)} />
          ))}
        </View>
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); void load(); }} />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: spacing.lg }}
          data={items}
          keyExtractor={(d) => d.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); void load(); }}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(`/dossier/${item.id}`)}>
              <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Body style={{ fontWeight: "700", flex: 1 }}>{item.title}</Body>
                  <Badge label={STATUS_LABEL_SQ[item.status] ?? item.status} color={statusColor(item.status)} />
                </View>
                <Muted>{item.trackingCode} • {item.phaseTitle}</Muted>
                <Muted>{item.institution}</Muted>
                {item.deadline && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Badge
                      label={`${item.deadline.label} — ${DEADLINE_STATE_SQ[item.deadlineState] ?? item.deadlineState}`}
                      color={stateColor(item.deadlineState)}
                    />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<EmptyState title="Asnjë dosje" hint="Provoni filtra të tjerë" />}
        />
      )}
    </View>
  );
}

function Pill({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.primary + "33" : "transparent",
        }}
      >
        <Body style={{ fontSize: 12, color: active ? colors.text : colors.textDim }}>{label}</Body>
      </View>
    </TouchableOpacity>
  );
}
