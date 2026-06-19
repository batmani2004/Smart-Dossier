import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api, type DossierDetail } from "../../src/api";
import { Badge, Body, Card, ErrorState, H1, H2, Loading, Muted } from "../../src/ui";
import { colors, spacing, stateColor, statusColor } from "../../src/theme";
import { DEADLINE_STATE_SQ, STATUS_LABEL_SQ, docLabel } from "../../src/labels";

export default function DossierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<DossierDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await api.dossier(String(id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "E panjohur");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!data) return <Loading />;

  const d = data.summary;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <H1>{d.title}</H1>
      <Muted>{d.trackingCode} • {d.processTitle}</Muted>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }}>
        <Badge label={STATUS_LABEL_SQ[d.status] ?? d.status} color={statusColor(d.status)} />
        <Badge label={DEADLINE_STATE_SQ[d.deadlineState] ?? d.deadlineState} color={stateColor(d.deadlineState)} />
        {d.criticalAlertCount > 0 && (
          <Badge label={`${d.criticalAlertCount} sinjalizime`} color={colors.danger} />
        )}
      </View>

      {data.phase && (
        <Card>
          <H2>Faza aktuale</H2>
          <Body style={{ fontWeight: "700" }}>{data.phase.order}. {data.phase.title}</Body>
          <Muted>{data.phase.institutions.join(", ")}</Muted>
          {data.phase.stepTitle ? <Body style={{ marginTop: spacing.sm }}>Hapi: {data.phase.stepTitle}</Body> : null}
          {data.phase.description ? <Muted>{data.phase.description}</Muted> : null}
        </Card>
      )}

      {data.nextStep && (
        <Card>
          <H2>Hapi tjetër</H2>
          <Body style={{ fontWeight: "700" }}>{data.nextStep.title}</Body>
          <Muted>{data.nextStep.institution}</Muted>
        </Card>
      )}
      {data.isFinal && (
        <Card><H2>✅ Procesi përfundoi</H2></Card>
      )}

      {data.deadline && (
        <Card>
          <H2>Afati</H2>
          <Body>{data.deadline.label}</Body>
          <Muted>
            {new Date(data.deadline.dueAt).toLocaleDateString("sq-AL")} •{" "}
            {data.deadline.daysRemaining != null
              ? data.deadline.daysRemaining >= 0
                ? `${data.deadline.daysRemaining} ditë të mbetura`
                : `${Math.abs(data.deadline.daysRemaining)} ditë vonesë`
              : ""}
          </Muted>
        </Card>
      )}

      {data.alerts.length > 0 && (
        <Card style={{ borderColor: colors.danger }}>
          <H2>🚨 Sinjalizime kritike</H2>
          {data.alerts.map((a, i) => (
            <View key={i} style={{ marginTop: spacing.sm }}>
              <Body style={{ fontWeight: "600" }}>{a.label}</Body>
              {a.description ? <Muted>{a.description}</Muted> : null}
            </View>
          ))}
        </Card>
      )}

      <Card>
        <H2>Dokumentet ({data.documents.length})</H2>
        {data.documents.length === 0 ? (
          <Muted>Pa dokumente</Muted>
        ) : (
          data.documents.map((doc) => (
            <View key={doc.id} style={{ marginTop: spacing.sm, flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Body>{docLabel(doc.type)}</Body>
                <Muted>{doc.name}</Muted>
              </View>
              <Badge label={doc.status} color={colors.info} />
            </View>
          ))
        )}
        {data.missingDocumentTypes.length > 0 && (
          <View style={{ marginTop: spacing.md }}>
            <Body style={{ color: colors.warning, fontWeight: "600" }}>Dokumente që mungojnë:</Body>
            {data.missingDocumentTypes.map((t) => (
              <Muted key={t}>• {docLabel(t)}</Muted>
            ))}
          </View>
        )}
      </Card>

      {data.parties.length > 0 && (
        <Card>
          <H2>Palët</H2>
          {data.parties.map((p, i) => (
            <Muted key={i}>{p.role}: {p.fullName}</Muted>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}
