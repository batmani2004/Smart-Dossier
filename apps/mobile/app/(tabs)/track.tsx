import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Body, H1, Muted } from "../../src/ui";
import { colors, radius, spacing } from "../../src/theme";

export default function TrackTab() {
  const [code, setCode] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
      <H1>Gjurmim qytetari</H1>
      <Muted>Shkruani kodin e dosjes ose hapni linkun e marrë me SMS.</Muted>

      <TextInput
        placeholder="p.sh. EKB-2026-000014"
        placeholderTextColor={colors.textDim}
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
        onSubmitEditing={() => code && router.push(`/track/${code.trim()}`)}
        style={{
          backgroundColor: colors.surface,
          color: colors.text,
          padding: spacing.lg,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          fontSize: 16,
        }}
      />

      <TouchableOpacity
        onPress={() => code && router.push(`/track/${code.trim()}`)}
        style={{
          backgroundColor: colors.primary,
          padding: spacing.lg,
          borderRadius: radius.md,
          alignItems: "center",
        }}
      >
        <Body style={{ color: colors.primaryText, fontWeight: "700" }}>Hap dosjen</Body>
      </TouchableOpacity>

      <View style={{ marginTop: spacing.lg }}>
        <Muted>Shembuj:</Muted>
        {["EKB-2026-000014", "EKB-2026-000001", "SHP-2026-000001"].map((c) => (
          <TouchableOpacity key={c} onPress={() => router.push(`/track/${c}`)}>
            <Body style={{ color: colors.primary, marginTop: spacing.sm }}>{c}</Body>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
