import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { pricePresets } from "../data";
import { theme } from "../theme";
import { FilterOptions, Listing } from "../types";

export function FilterModal({
  visible,
  filters,
  items,
  onApply,
  onReset,
  onClose,
}: {
  visible: boolean;
  filters: FilterOptions;
  items?: Listing[];
  onApply: (filters: FilterOptions) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [sortBy, setSortBy] = useState<FilterOptions["sortBy"]>(filters.sortBy);
  const [condition, setCondition] = useState(filters.condition);
  const [minPrice, setMinPrice] = useState(
    filters.minPrice !== null && filters.minPrice !== undefined
      ? String(filters.minPrice)
      : ""
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice !== null && filters.maxPrice !== undefined
      ? String(filters.maxPrice)
      : ""
  );

  // Synchronize draft state whenever modal is opened
  useEffect(() => {
    if (visible) {
      setSortBy(filters.sortBy);
      setCondition(filters.condition);
      setMinPrice(
        filters.minPrice !== null && filters.minPrice !== undefined
          ? String(filters.minPrice)
          : ""
      );
      setMaxPrice(
        filters.maxPrice !== null && filters.maxPrice !== undefined
          ? String(filters.maxPrice)
          : ""
      );
    }
  }, [visible, filters]);

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

  // Parse numeric values
  const parsedMin =
    minPrice.trim() !== "" && !isNaN(Number(minPrice))
      ? Math.max(0, Number(minPrice))
      : null;
  const parsedMax =
    maxPrice.trim() !== "" && !isNaN(Number(maxPrice))
      ? Math.max(0, Number(maxPrice))
      : null;

  const isInvalidRange =
    parsedMin !== null && parsedMax !== null && parsedMin > parsedMax;

  // Active price preset detection
  const activePresetId = useMemo(() => {
    const matched = pricePresets.find(
      (p) => p.min === parsedMin && p.max === parsedMax
    );
    if (matched) return matched.id;
    if (parsedMin === null && parsedMax === null) return "all";
    return "custom";
  }, [parsedMin, parsedMax]);

  // Live match calculation for instant feedback
  const matchingCount = useMemo(() => {
    if (!items || isInvalidRange) return null;
    return items.filter((item) => {
      const matchCond = condition === "All" || item.condition === condition;
      const matchMin = parsedMin === null || item.price >= parsedMin;
      const matchMax = parsedMax === null || item.price <= parsedMax;
      return matchCond && matchMin && matchMax;
    }).length;
  }, [items, condition, parsedMin, parsedMax, isInvalidRange]);

  const handleSelectPreset = (preset: (typeof pricePresets)[0]) => {
    setMinPrice(preset.min !== null ? String(preset.min) : "");
    setMaxPrice(preset.max !== null ? String(preset.max) : "");
  };

  const handleClearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const handleApply = () => {
    if (isInvalidRange) return;
    onApply({
      ...filters,
      sortBy,
      condition,
      minPrice: parsedMin,
      maxPrice: parsedMax,
    });
    onClose();
  };

  const handleReset = () => {
    setSortBy("popular");
    setCondition("All");
    setMinPrice("");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation?.()}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Filter & Sort</Text>
                <Text style={styles.subtitle}>
                  Customize budget, condition & sorting
                </Text>
              </View>
              <Pressable
                onPress={handleReset}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.resetBtn,
                  pressed && styles.resetBtnPressed,
                ]}
              >
                <Text style={styles.resetText}>Reset All</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* PRICE RANGE SECTION */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionIcon}>🏷️</Text>
                  <Text style={styles.sectionLabel}>PRICE RANGE ($)</Text>
                </View>
                {(minPrice !== "" || maxPrice !== "") && (
                  <Pressable onPress={handleClearPrice} hitSlop={6}>
                    <Text style={styles.sectionActionText}>Clear Price</Text>
                  </Pressable>
                )}
              </View>

              {/* Quick Price Range Presets */}
              <View style={styles.presetGrid}>
                {pricePresets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <Pressable
                      key={preset.id}
                      style={({ pressed }) => [
                        styles.presetChip,
                        isActive && styles.presetChipActive,
                        pressed && styles.chipPressed,
                      ]}
                      onPress={() => handleSelectPreset(preset)}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isActive && styles.presetChipTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Custom Min / Max Price Inputs */}
              <View style={styles.customPriceBox}>
                <Text style={styles.customPriceTitle}>Custom Price Range</Text>
                <View style={styles.priceInputsRow}>
                  {/* Min Input */}
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceInputLabel}>MINIMUM</Text>
                    <View
                      style={[
                        styles.priceInputContainer,
                        isInvalidRange && styles.inputError,
                      ]}
                    >
                      <Text style={styles.dollarSign}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={theme.colors.textMuted}
                        value={minPrice}
                        onChangeText={(txt) => setMinPrice(txt.replace(/[^0-9]/g, ""))}
                      />
                      {minPrice.length > 0 && (
                        <Pressable
                          onPress={() => setMinPrice("")}
                          style={styles.clearMiniBtn}
                          hitSlop={6}
                        >
                          <Text style={styles.clearMiniText}>✕</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <View style={styles.priceDividerContainer}>
                    <Text style={styles.priceDividerText}>to</Text>
                  </View>

                  {/* Max Input */}
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceInputLabel}>MAXIMUM</Text>
                    <View
                      style={[
                        styles.priceInputContainer,
                        isInvalidRange && styles.inputError,
                      ]}
                    >
                      <Text style={styles.dollarSign}>$</Text>
                      <TextInput
                        style={styles.priceInput}
                        keyboardType="numeric"
                        placeholder="Any"
                        placeholderTextColor={theme.colors.textMuted}
                        value={maxPrice}
                        onChangeText={(txt) => setMaxPrice(txt.replace(/[^0-9]/g, ""))}
                      />
                      {maxPrice.length > 0 && (
                        <Pressable
                          onPress={() => setMaxPrice("")}
                          style={styles.clearMiniBtn}
                          hitSlop={6}
                        >
                          <Text style={styles.clearMiniText}>✕</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>

                {/* Validation message */}
                {isInvalidRange && (
                  <View style={styles.errorNotice}>
                    <Text style={styles.errorText}>
                      ⚠️ Minimum price (${parsedMin}) cannot exceed maximum price (${parsedMax})
                    </Text>
                  </View>
                )}

                {/* Helper info badge */}
                {!isInvalidRange && (parsedMin !== null || parsedMax !== null) && (
                  <View style={styles.activePriceBanner}>
                    <Text style={styles.activePriceBannerText}>
                      🎯 Showing items:{" "}
                      <Text style={styles.activePriceBannerBold}>
                        {parsedMin !== null && parsedMax !== null
                          ? `$${parsedMin} – $${parsedMax}`
                          : parsedMin !== null
                          ? `$${parsedMin} and above`
                          : `Up to $${parsedMax}`}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* SORT BY SECTION */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionIcon}>⚡</Text>
                  <Text style={styles.sectionLabel}>SORT BY</Text>
                </View>
              </View>
              <View style={styles.sortGrid}>
                {sortOptions.map((opt) => {
                  const active = sortBy === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      style={({ pressed }) => [
                        styles.sortChip,
                        active && styles.sortChipActive,
                        pressed && styles.chipPressed,
                      ]}
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

              {/* CONDITION SECTION */}
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionIcon}>✨</Text>
                  <Text style={styles.sectionLabel}>ITEM CONDITION</Text>
                </View>
              </View>
              <View style={styles.chipsWrap}>
                {conditionOptions.map((cond) => {
                  const active = condition === cond;
                  return (
                    <Pressable
                      key={cond}
                      style={({ pressed }) => [
                        styles.condChip,
                        active && styles.condChipActive,
                        pressed && styles.chipPressed,
                      ]}
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
            </ScrollView>

            {/* ACTION BUTTONS FOOTER */}
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [
                  styles.applyButton,
                  isInvalidRange && styles.applyButtonDisabled,
                  pressed && !isInvalidRange && styles.applyButtonPressed,
                ]}
                onPress={handleApply}
                disabled={isInvalidRange}
              >
                <Text style={styles.applyButtonText}>
                  {isInvalidRange
                    ? "Enter Valid Price Range"
                    : matchingCount !== null
                    ? `Show ${matchingCount} Result${matchingCount === 1 ? "" : "s"}`
                    : "Apply Filters"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90%",
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 28,
    ...theme.shadows.lg,
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
  },
  resetBtnPressed: {
    opacity: 0.7,
  },
  resetText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionIcon: {
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.red,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  presetChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  presetChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  chipPressed: {
    transform: [{ scale: 0.97 }],
  },
  customPriceBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 10,
  },
  customPriceTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  priceInputsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  inputError: {
    borderColor: theme.colors.red,
    backgroundColor: theme.colors.redLight,
  },
  dollarSign: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.primary,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  clearMiniBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  clearMiniText: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.textMuted,
  },
  priceDividerContainer: {
    paddingTop: 20,
    paddingHorizontal: 2,
  },
  priceDividerText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  errorNotice: {
    marginTop: 10,
    padding: 8,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.redLight,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 11,
    fontWeight: "700",
  },
  activePriceBanner: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.primaryMuted,
  },
  activePriceBannerText: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  activePriceBannerBold: {
    fontWeight: "800",
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
    ...theme.shadows.glow,
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
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  applyButton: {
    height: 50,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  applyButtonDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.textMuted,
  },
  applyButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
