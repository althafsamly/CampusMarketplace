import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ListingCard } from "../components/ListingCard";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Listing } from "../types";

export function MyListingsPage({
  items,
  onOpen,
  onSell,
}: {
  items: Listing[];
  onOpen: (item: Listing) => void;
  onSell: () => void;
}) {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageTitle
        title="My Listings"
        subtitle="Manage items you're selling to campus peers"
        rightAction={
          <Pressable style={styles.newButton} onPress={onSell}>
            <Text style={styles.newButtonText}>+ New</Text>
          </Pressable>
        }
      />

      {/* Seller Dashboard Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>Active Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${totalValue}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Response Rate</Text>
        </View>
      </View>

      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <EmptyState
            icon="🏷️"
            title="No active listings"
            message="Have a textbook or dorm furniture you don't need? List it in 30 seconds."
            action="+ Post Your First Item"
            onAction={onSell}
          />
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={false}
            onSave={() => undefined}
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
  newButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    ...theme.shadows.sm,
  },
  newButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  columns: {
    gap: 12,
  },
  grid: {
    gap: 12,
  },
});
