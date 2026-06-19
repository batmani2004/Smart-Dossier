import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api, type TrackingPayload } from "../../src/api";
import { Badge, Body, Card, ErrorState, H1, H2, Loading, Muted } from "../../src/ui";
import { colors, spacing, stateColor } from "../../src/theme";
import { DEADLINE_STATE_SQ } from "../../src/labels";

export default function TrackScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [data, setData] = useState<TrackingPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api.track(String(code)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "E panjohur");
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!data) return <Loading />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <H1>{data.process}</H1>
      <Muted>Kod: {data.trackingCode}</Muted>

      <Card>
        <H2>Faza aktuale</H2>
        <Body style={{ fontWeight: "700" }}>
          {data.currentPhase.number}. {data.currentPhase.title}
        </Body>
        <Muted>{data.currentPhase.institution}</Muted>
        {data.currentPhase.description ? <Muted>{data.currentPhase.description}</Muted> : null}
      </Card>

      <Card>
        <H2>Ecuria</H2>
        {data.phasesTimeline.map((p) => (
          <View key={p.order} style={{ flexDirection: "row", gap: spacing.md, paddingVertical: spacing.sm }}>
            <Body style={{ width: 28, color: colors.textDim }}>{p.order}.</Body>
            <View style={{ flex: 1 }}>
              <Body style={{ fontWeight: p.state === "current" ? "700" : "400" }}>{p.title}</Body>
              <Muted>{p.institution}</Muted>
            </View>
            <Badge
              label={p.state === "completed" ? "✓" : p.state === "current" ? "Aktuale" : "—"}
              color={p.state === "completed" ? colors.success : p.state === "current" ? colors.primary : colors.textDim}
            />
          </View>
        ))}
      </Card>

      {data.nextMilestone && (
        <Card>
          <H2>Hapi tjetër</H2>
          <Body>{data.nextMilestone}</Body>
          {data.nextInstitution ? <Muted>{data.nextInstitution}</Muted> : null}
        </Card>
      )}

      {data.deadline && (
        <Card>
          <H2>Afati</H2>
          <Body>{data.deadline.label}</Body>
          <Badge
            label={DEADLINE_STATE_SQ[data.deadline.state] ?? data.deadline.state}
            color={stateColor(data.deadline.state)}
          />
          <Muted>
            {data.deadline.daysRemaining != null
              ? data.deadline.daysRemaining >= 0
                ? `${data.deadline.daysRemaining} ditë të mbetura`
                : `${Math.abs(data.deadline.daysRemaining)} ditë vonesë`
              : ""}
          </Muted>
        </Card>
      )}

      {data.missingDocuments.length > 0 && (
        <Card style={{ borderColor: colors.warning }}>
          <H2>📄 Dokumente që duhen sjellë</H2>
          {data.missingDocuments.map((m) => (
            <Body key={m.type}>• {m.label}</Body>
          ))}
        </Card>
      )}

      {data.notifications.length > 0 && (
        <Card>
          <H2>Njoftimet</H2>
          {data.notifications.map((n, i) => (
            <View key={i} style={{ marginTop: spacing.sm }}>
              <Body>{n.action}</Body>
              <Muted>{new Date(n.at).toLocaleString("sq-AL")}</Muted>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}
