import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ListingCard } from "../components/ListingCard";
import { categoryList, formatPriceRange, pricePresets } from "../data";
import { theme } from "../theme";
import { FilterOptions, Listing } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  campus,
  savedIds,
  filters,
  hasActiveFilters,
  onQueryChange,
  onCategoryChange,
  onCampusPress,
  onFilterPress,
  onSelectPricePreset,
  onClearPriceFilter,
  onClearConditionFilter,
  onClearSortFilter,
  onResetAllFilters,
  onSave,
  onOpen,
  onProfile,
}: {
  items: Listing[];
  query: string;
  category: string;
  campus: string;
  savedIds: string[];
  filters?: FilterOptions;
  hasActiveFilters: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCampusPress: () => void;
  onFilterPress: () => void;
  onSelectPricePreset?: (min: number | null, max: number | null) => void;
  onClearPriceFilter?: () => void;
  onClearConditionFilter?: () => void;
  onClearSortFilter?: () => void;
  onResetAllFilters?: () => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
}) {
  const hasPriceFilter = Boolean(
    filters && (filters.minPrice !== null || filters.maxPrice !== null)
  );

  const priceLabel = hasPriceFilter
    ? formatPriceRange(filters!.minPrice, filters!.maxPrice)
    : null;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar with Campus Selector & Profile */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.campusPill,
            pressed && styles.campusPillPressed,
          ]}
          onPress={onCampusPress}
        >
          <Text style={styles.campusIcon}>📍</Text>
          <Text style={styles.campusText} numberOfLines={1}>
            {campus}
          </Text>
          <Text style={styles.campusChevron}>▾</Text>
        </Pressable>

        <View style={styles.topBarRight}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
          <Pressable style={styles.profileButton} onPress={onProfile}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
              }}
              style={styles.profileAvatar}
            />
          </Pressable>
        </View>
      </View>

      {/* Hero Headline */}
      <View style={styles.heroSection}>
        <Text style={styles.eyebrow}>CAMPUS MARKETPLACE</Text>
        <Text style={styles.heading}>
          Find great deals,{"\n"}
          <Text style={styles.headingAccent}>right on campus.</Text>
        </Text>
      </View>

      {/* Modern Search & Filter Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search textbooks, tech, dorm..."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => onQueryChange("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={[
            styles.filterButton,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          onPress={onFilterPress}
          accessibilityLabel="Filter and sort options"
        >
          <Text
            style={[
              styles.filterIcon,
              hasActiveFilters && styles.filterIconActive,
            ]}
          >
            ⚙
          </Text>
          {hasActiveFilters && <View style={styles.filterDot} />}
        </Pressable>
      </View>

      {/* Horizontal Category Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryCarousel}
      >
        {categoryList.map((cat) => {
          const isActive = category === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onCategoryChange(cat.id)}
              style={({ pressed }) => [
                styles.categoryChip,
                isActive && styles.categoryChipActive,
                pressed && styles.categoryChipPressed,
              ]}
            >
              <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  isActive && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Quick Price Filter Bar */}
      <View style={styles.priceFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceFilterCarousel}
        >
          {pricePresets.map((preset) => {
            const isSelected =
              filters &&
              filters.minPrice === preset.min &&
              filters.maxPrice === preset.max;
            return (
              <Pressable
                key={preset.id}
                onPress={() => onSelectPricePreset?.(preset.min, preset.max)}
                style={({ pressed }) => [
                  styles.priceChip,
                  isSelected && styles.priceChipActive,
                  pressed && styles.priceChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    isSelected && styles.priceChipTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}

          {/* If custom price range is set that doesn't match any preset */}
          {hasPriceFilter &&
            !pricePresets.some(
              (p) =>
                p.min === filters?.minPrice && p.max === filters?.maxPrice
            ) && (
              <Pressable
                onPress={onClearPriceFilter}
                style={[styles.priceChip, styles.priceChipActive]}
              >
                <Text style={[styles.priceChipText, styles.priceChipTextActive]}>
                  {priceLabel} ✕
                </Text>
              </Pressable>
            )}
        </ScrollView>
      </View>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersScroll}
          >
            {hasPriceFilter && (
              <Pressable
                style={styles.activeFilterBadge}
                onPress={onClearPriceFilter}
              >
                <Text style={styles.activeFilterBadgeText}>🏷️ {priceLabel}</Text>
                <View style={styles.activeFilterCloseCircle}>
                  <Text style={styles.activeFilterCloseText}>✕</Text>
                </View>
              </Pressable>
            )}

            {filters?.condition && filters.condition !== "All" && (
              <Pressable
                style={styles.activeFilterBadge}
                onPress={onClearConditionFilter}
              >
                <Text style={styles.activeFilterBadgeText}>
                  ✨ {filters.condition}
                </Text>
                <View style={styles.activeFilterCloseCircle}>
                  <Text style={styles.activeFilterCloseText}>✕</Text>
                </View>
              </Pressable>
            )}

            {filters?.sortBy && filters.sortBy !== "popular" && (
              <Pressable
                style={styles.activeFilterBadge}
                onPress={onClearSortFilter}
              >
                <Text style={styles.activeFilterBadgeText}>
                  ⚡{" "}
                  {filters.sortBy === "price_asc"
                    ? "Price: Low to High"
                    : filters.sortBy === "price_desc"
                    ? "Price: High to Low"
                    : "Newly Listed"}
                </Text>
                <View style={styles.activeFilterCloseCircle}>
                  <Text style={styles.activeFilterCloseText}>✕</Text>
                </View>
              </Pressable>
            )}

            <Pressable
              style={styles.clearAllButton}
              onPress={onResetAllFilters}
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* Section Header */}
      <View style={styles.feedHeader}>
        <View style={styles.feedTitleContainer}>
          <Text style={styles.feedTitle}>
            {category === "All items" ? "Recommended for you" : category}
          </Text>
          <Text style={styles.feedSubtitle}>
            {hasPriceFilter
              ? `Showing deals in ${priceLabel} near ${campus === "All Campuses" ? "campus" : campus}`
              : `Verified student listings near ${campus === "All Campuses" ? "campus" : campus}`}
          </Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{items.length} items</Text>
        </View>
      </View>

      {/* Product Grid */}
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.gridColumns}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>
              {hasPriceFilter
                ? `No items in ${priceLabel}`
                : "No items found"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasPriceFilter
                ? "Try adjusting your price range or exploring other categories."
                : "Try tweaking your search keywords or resetting filters."}
            </Text>
            {hasPriceFilter && (
              <Pressable
                style={styles.emptyActionBtn}
                onPress={onClearPriceFilter}
              >
                <Text style={styles.emptyActionBtnText}>
                  Reset Price Filter
                </Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(item.id)}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  campusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
    ...theme.shadows.sm,
  },
  campusPillPressed: {
    opacity: 0.8,
  },
  campusIcon: {
    fontSize: 14,
  },
  campusText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    maxWidth: 160,
  },
  campusChevron: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    overflow: "hidden",
  },
  profileAvatar: {
    width: "100%",
    height: "100%",
  },
  heroSection: {
    marginTop: 14,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: theme.colors.primaryLight,
    marginBottom: 4,
  },
  heading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    letterSpacing: -0.6,
  },
  headingAccent: {
    color: theme.colors.primary,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  searchContainer: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 18,
    color: theme.colors.textMuted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "800",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...theme.shadows.sm,
  },
  filterButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryMuted,
  },
  filterIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  filterIconActive: {
    color: theme.colors.primary,
  },
  filterDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: theme.colors.accent,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  categoryCarousel: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
    ...theme.shadows.sm,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  categoryChipPressed: {
    transform: [{ scale: 0.96 }],
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  categoryLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  priceFilterContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  priceFilterCarousel: {
    gap: 7,
    paddingVertical: 2,
  },
  priceChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  priceChipActive: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: theme.colors.primary,
  },
  priceChipPressed: {
    transform: [{ scale: 0.96 }],
  },
  priceChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  priceChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  activeFiltersSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  activeFiltersScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.accent,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    gap: 6,
  },
  activeFilterBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  activeFilterCloseCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterCloseText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "900",
    marginTop: -1,
  },
  clearAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.red,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 12,
  },
  feedTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  feedSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  countPill: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primaryLight,
  },
  gridContainer: {
    gap: 12,
  },
  gridColumns: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 280,
  },
  emptyActionBtn: {
    marginTop: 18,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    ...theme.shadows.sm,
  },
  emptyActionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
