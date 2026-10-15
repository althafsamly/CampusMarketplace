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
import { categoryList } from "../data";
import { theme } from "../theme";
import { Listing } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  campus,
  savedIds,
  hasActiveFilters,
  onQueryChange,
  onCategoryChange,
  onCampusPress,
  onFilterPress,
  onSave,
  onOpen,
  onProfile,
}: {
  items: Listing[];
  query: string;
  category: string;
  campus: string;
  savedIds: string[];
  hasActiveFilters: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCampusPress: () => void;
  onFilterPress: () => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
}) {
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

      {/* Section Header */}
      <View style={styles.feedHeader}>
        <View>
          <Text style={styles.feedTitle}>
            {category === "All items" ? "Recommended for you" : category}
          </Text>
          <Text style={styles.feedSubtitle}>
            Verified student listings near {campus === "All Campuses" ? "campus" : campus}
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
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              Try tweaking your search keywords or resetting filters.
            </Text>
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
    marginBottom: 16,
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
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  categoryCarousel: {
    gap: 8,
    paddingBottom: 8,
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
  feedHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
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
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
});
