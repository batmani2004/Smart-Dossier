import { useState } from "react";
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { api, type ExtractResult } from "../../src/api";
import { Body, Card, H1, H2, Loading, Muted } from "../../src/ui";
import { colors, radius, spacing } from "../../src/theme";

type Proc = "ekb_privatization" | "expropriation";

const DOC_TYPES = [
  "family_certificate",
  "ashk_certificate",
  "income_proof",
  "valuation_report",
];

export default function UploadScreen() {
  const [proc, setProc] = useState<Proc>("ekb_privatization");
  const [docType, setDocType] = useState<string>("family_certificate");
  const [fileName, setFileName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pickImage() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], base64: false });
    if (!r.canceled && r.assets[0]) {
      const a = r.assets[0];
      setFileName(a.fileName ?? "image.jpg");
      Alert.alert(
        "Foto u zgjodh",
        "OCR i fotos nuk është i disponueshëm në demo. Ju lutemi ngjisni tekstin e dokumentit më poshtë.",
      );
    }
  }

  async function pickDocument() {
    const r = await DocumentPicker.getDocumentAsync({ type: ["text/*", "application/pdf"] });
    if (!r.canceled && r.assets[0]) {
      const a = r.assets[0];
      setFileName(a.name);
      if (a.mimeType?.startsWith("text/")) {
        try {
          const content = await FileSystem.readAsStringAsync(a.uri);
          setText(content);
        } catch (e) {
          setError(e instanceof Error ? e.message : "S'u lexua dot skedari");
        }
      } else {
        Alert.alert(
          "PDF u zgjodh",
          "Nxjerrja e tekstit nga PDF nuk është e disponueshme në mobile. Ju lutemi ngjisni tekstin më poshtë.",
        );
      }
    }
  }

  async function extract() {
    if (!text.trim()) {
      setError("Shkruani ose ngjisni tekstin e dokumentit.");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await api.extract({ processKind: proc, documentType: docType, text, fileName });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gabim rrjeti");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <H1>Ngarko dokument</H1>
      <Muted>Foto, PDF ose tekst. AI nxjerr fushat e strukturuara.</Muted>

      <Card>
        <H2>Procesi</H2>
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
          {(["ekb_privatization", "expropriation"] as Proc[]).map((p) => (
            <Pill key={p} active={proc === p} label={p === "ekb_privatization" ? "EKB" : "Shpronësim"} onPress={() => setProc(p)} />
          ))}
        </View>

        <H2>Tipi i dokumentit</H2>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm }}>
          {DOC_TYPES.map((t) => (
            <Pill key={t} active={docType === t} label={t} onPress={() => setDocType(t)} />
          ))}
        </View>
      </Card>

      <Card>
        <H2>Burimi</H2>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <Button label="📷 Foto" onPress={pickImage} />
          <Button label="📄 Skedar" onPress={pickDocument} />
        </View>
        {fileName ? <Muted>Zgjedhur: {fileName}</Muted> : null}

        <H2>Teksti</H2>
        <TextInput
          multiline
          numberOfLines={8}
          placeholder="Ngjisni tekstin e dokumentit këtu…"
          placeholderTextColor={colors.textDim}
          value={text}
          onChangeText={setText}
          style={{
            backgroundColor: colors.surfaceAlt,
            color: colors.text,
            borderRadius: radius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            minHeight: 160,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          disabled={busy}
          onPress={extract}
          style={{
            backgroundColor: busy ? colors.border : colors.primary,
            padding: spacing.lg,
            borderRadius: radius.md,
            alignItems: "center",
            marginTop: spacing.md,
          }}
        >
          <Body style={{ color: colors.primaryText, fontWeight: "700" }}>
            {busy ? "Po procesohet…" : "Nxirr me AI"}
          </Body>
        </TouchableOpacity>

        {error ? <Body style={{ color: colors.danger, marginTop: spacing.sm }}>{error}</Body> : null}
      </Card>

      {busy && <Loading label="AI po lexon dokumentin…" />}

      {result && result.ok && (
        <Card>
          <H2>✅ Fushat e nxjerra</H2>
          <Muted>Besueshmëria e përgjithshme: {(result.result.overallConfidence * 100).toFixed(0)}%</Muted>
          {Object.entries(result.result.fields).map(([k, v]) => (
            <View key={k} style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Body style={{ fontWeight: "700" }}>{k}</Body>
              <Body>{v.value === null ? "—" : String(v.value)}</Body>
              <Muted>Besueshmëri: {(v.confidence * 100).toFixed(0)}%</Muted>
              {v.sourceEvidence ? <Muted>“{v.sourceEvidence}”</Muted> : null}
            </View>
          ))}
          {result.result.missingFields.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <Body style={{ color: colors.warning, fontWeight: "600" }}>Fusha që mungojnë:</Body>
              <Muted>{result.result.missingFields.join(", ")}</Muted>
            </View>
          )}
        </Card>
      )}

      {result && !result.ok && (
        <Card style={{ borderColor: colors.danger }}>
          <H2>Gabim AI</H2>
          <Body>{result.error}</Body>
        </Card>
      )}
    </ScrollView>
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

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: colors.surfaceAlt,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Body>{label}</Body>
    </TouchableOpacity>
  );
}
