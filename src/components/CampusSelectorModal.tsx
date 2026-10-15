import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { campusLocations } from "../data";
import { theme } from "../theme";

export function CampusSelectorModal({
  visible,
  selectedCampus,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedCampus: string;
  onSelect: (campus: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation?.()}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Select Campus Zone</Text>
            <Text style={styles.subtitle}>
              Filter listings by meetup location
            </Text>
          </View>

          <View style={styles.list}>
            {campusLocations.map((campus) => {
              const active = selectedCampus === campus;
              return (
                <Pressable
                  key={campus}
                  style={({ pressed }) => [
                    styles.item,
                    active && styles.itemActive,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={() => {
                    onSelect(campus);
                    onClose();
                  }}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.pinIcon}>📍</Text>
                    <Text
                      style={[
                        styles.itemLabel,
                        active && styles.itemLabelActive,
                      ]}
                    >
                      {campus}
                    </Text>
                  </View>
                  {active && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 3,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
  },
  itemActive: {
    backgroundColor: theme.colors.primaryMuted,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  itemPressed: {
    opacity: 0.8,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pinIcon: {
    fontSize: 16,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  itemLabelActive: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
