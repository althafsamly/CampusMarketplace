import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ListingCard } from "../components/ListingCard";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Listing } from "../types";

export function SavedPage({
  items,
  onSave,
  onOpen,
  onBrowse,
}: {
  items: Listing[];
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onBrowse?: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageTitle
        title="Saved Items"
        subtitle="Keep track of dorm deals and textbooks you love"
        rightAction={
          items.length > 0 ? (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{items.length} saved</Text>
            </View>
          ) : undefined
        }
      />

      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <EmptyState
            icon="♡"
            title="No saved items yet"
            message="Tap the heart on any listing to save it here for later price checks or meetups."
            action="Discover Campus Finds"
            onAction={onBrowse}
          />
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
  columns: {
    gap: 12,
  },
  grid: {
    gap: 12,
    marginTop: 8,
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
});
