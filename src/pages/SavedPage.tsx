import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ListingCard } from "../components/ListingCard";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Listing } from "../types";

type SortOption = "recent" | "price_asc" | "price_desc" | "discount";

export function SavedPage({
  items,
  onSave,
  onOpen,
  onBrowse,
  onClearAll,
  onContact,
}: {
  items: Listing[];
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onBrowse?: () => void;
  onClearAll?: () => void;
  onContact?: (item: Listing) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Calculate statistics for saved items
  const stats = useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const totalRetail = items.reduce(
      (sum, item) => sum + (item.originalPrice || item.price),
      0,
    );
    const totalSavings = Math.max(0, totalRetail - totalValue);

    // Categories present in saved items
    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    return {
      totalCount: items.length,
      totalValue,
      totalSavings,
      categoryCounts,
    };
  }, [items]);

  // Unique categories in saved items
  const categories = useMemo(() => {
    const keys = Object.keys(stats.categoryCounts);
    return ["All", ...keys];
  }, [stats.categoryCounts]);

  // Filtered and sorted saved items
  const displayedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesCat =
          selectedCategory === "All" || item.category === selectedCategory;

        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.seller.toLowerCase().includes(query) ||
          item.campus.toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query);

        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "discount") {
          const discA = a.originalPrice ? a.originalPrice - a.price : 0;
          const discB = b.originalPrice ? b.originalPrice - b.price : 0;
          return discB - discA;
        }
        return 0; // "recent" keeps default list order
      });
  }, [items, searchQuery, selectedCategory, sortBy]);

  const handleClearAllConfirm = () => {
    if (!onClearAll || items.length === 0) return;
    Alert.alert(
      "Clear All Saved Items?",
      `Are you sure you want to remove all ${items.length} items from your saved list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: onClearAll,
        },
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Title & Clear Action */}
      <PageTitle
        title="Saved Items"
        subtitle="Track favorite textbooks, tech, and dorm deals"
        rightAction={
          items.length > 0 ? (
            <View style={styles.headerRight}>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{items.length} saved</Text>
              </View>
              {onClearAll && (
                <Pressable
                  style={({ pressed }) => [
                    styles.clearAllBtn,
                    pressed && styles.clearAllBtnPressed,
                  ]}
                  onPress={handleClearAllConfirm}
                >
                  <Text style={styles.clearAllText}>Clear</Text>
                </Pressable>
              )}
            </View>
          ) : undefined
        }
      />

      {items.length > 0 && (
        <>
          {/* Wishlist Summary / Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>WISHLIST VALUE</Text>
              <Text style={styles.statValue}>${stats.totalValue}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>POTENTIAL SAVINGS</Text>
              <Text style={styles.statSavings}>
                {stats.totalSavings > 0
                  ? `-$${stats.totalSavings} off retail`
                  : "Great campus rates"}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Text style={styles.statLabel}>SAVED ITEMS</Text>
              <Text style={styles.statValue}>{stats.totalCount}</Text>
            </View>
          </View>

          {/* Quick Search inside Saved */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Filter saved listings..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
                style={styles.searchClearBtn}
              >
                <Text style={styles.searchClearText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Category Filter Chips */}
          {categories.length > 2 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChips}
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                const count =
                  cat === "All"
                    ? items.length
                    : stats.categoryCounts[cat] || 0;

                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.chip,
                      active && styles.chipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {cat} ({count})
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Sort Selector Bar */}
          <View style={styles.sortBar}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortOptions}
            >
              {(
                [
                  { id: "recent", label: "Recently Saved" },
                  { id: "price_asc", label: "$ Low to High" },
                  { id: "price_desc", label: "$ High to Low" },
                  { id: "discount", label: "Top Discounts" },
                ] as const
              ).map((opt) => {
                const active = sortBy === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.sortPill,
                      active && styles.sortPillActive,
                    ]}
                    onPress={() => setSortBy(opt.id)}
                  >
                    <Text
                      style={[
                        styles.sortPillText,
                        active && styles.sortPillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}

      {/* Grid of Saved Items */}
      <FlatList
        data={displayedItems}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          items.length === 0 ? (
            <EmptyState
              icon="♡"
              title="No saved items yet"
              message="Tap the heart on any campus listing to bookmark it here for easy price checks and quick messages."
              action="Discover Campus Finds"
              onAction={onBrowse}
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="No matching saved items"
              message={`We couldn't find any saved items matching "${searchQuery}".`}
              action="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            />
          )
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved
            onSave={() => onSave(item.id)}
            onOpen={() => onOpen(item)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  countText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  clearAllBtn: {
    backgroundColor: theme.colors.redLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  clearAllBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  clearAllText: {
    color: theme.colors.red,
    fontSize: 11,
    fontWeight: "700",
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    ...theme.shadows.sm,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.borderLight,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  statSavings: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.accent,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  searchClearText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  categoryChips: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortPillActive: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: theme.colors.primary,
  },
  sortPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  sortPillTextActive: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  columns: {
    gap: 12,
  },
  grid: {
    gap: 12,
    marginTop: 4,
  },
});
