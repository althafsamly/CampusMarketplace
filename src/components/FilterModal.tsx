import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { FilterOptions } from "../types";

export function FilterModal({
  visible,
  filters,
  onApply,
  onReset,
  onClose,
}: {
  visible: boolean;
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [condition, setCondition] = useState(filters.condition);
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice ? String(filters.maxPrice) : ""
  );

  const sortOptions: { id: FilterOptions["sortBy"]; label: string }[] = [
    { id: "popular", label: "🔥 Most Popular" },
    { id: "newest", label: "⚡ Newly Listed" },
    { id: "price_asc", label: "🏷️ Price: Low to High" },
    { id: "price_desc", label: "💎 Price: High to Low" },
  ];

  const conditionOptions = [
    "All",
    "Brand new",
    "Like new",
    "Good condition",
    "Fair",
  ];

  const handleApply = () => {
    onApply({
      ...filters,
      sortBy,
      condition,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
    onClose();
  };

  const handleReset = () => {
    setSortBy("popular");
    setCondition("All");
    setMaxPrice("");
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation?.()}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Filter & Sort</Text>
            <Pressable onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          {/* Sort By Section */}
          <Text style={styles.sectionLabel}>SORT BY</Text>
          <View style={styles.sortGrid}>
            {sortOptions.map((opt) => {
              const active = sortBy === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  style={[styles.sortChip, active && styles.sortChipActive]}
                  onPress={() => setSortBy(opt.id)}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      active && styles.sortChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Condition Section */}
          <Text style={styles.sectionLabel}>CONDITION</Text>
          <View style={styles.chipsWrap}>
            {conditionOptions.map((cond) => {
              const active = condition === cond;
              return (
                <Pressable
                  key={cond}
                  style={[styles.condChip, active && styles.condChipActive]}
                  onPress={() => setCondition(cond)}
                >
                  <Text
                    style={[
                      styles.condChipText,
                      active && styles.condChipTextActive,
                    ]}
                  >
                    {cond}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Max Price Section */}
          <Text style={styles.sectionLabel}>MAXIMUM BUDGET ($)</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="Any budget"
              placeholderTextColor={theme.colors.textMuted}
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.footer}>
            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Show Results</Text>
            </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.textPrimary,
  },
  resetText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 10,
  },
  sortGrid: {
    gap: 8,
  },
  sortChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortChipActive: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: theme.colors.accent,
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  sortChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  condChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  condChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  condChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  condChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textMuted,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  footer: {
    marginTop: 24,
  },
  applyButton: {
    height: 50,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
