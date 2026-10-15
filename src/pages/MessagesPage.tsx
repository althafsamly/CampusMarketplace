import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";
import { Conversation } from "../types";

export function MessagesPage({
  conversations,
  onOpenConversation,
  onBrowse,
}: {
  conversations: Conversation[];
  onOpenConversation: (conv: Conversation) => void;
  onBrowse: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageTitle
        title="Messages"
        subtitle="Chat with campus buyers and sellers"
        rightAction={
          <View style={styles.verifiedCount}>
            <Text style={styles.verifiedCountText}>
              {conversations.length} Active
            </Text>
          </View>
        }
      />

      {/* Campus Safety Banner */}
      <View style={styles.safetyCard}>
        <Text style={styles.safetyIcon}>🛡️</Text>
        <View style={styles.safetyContent}>
          <Text style={styles.safetyTitle}>Campus Meetup Safety</Text>
          <Text style={styles.safetyDesc}>
            Trade in public campus areas (Student Union, Library cafe, Quad).
          </Text>
        </View>
      </View>

      {/* Conversations list */}
      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No conversations yet"
          message="When you message a student seller about an item, your conversations will show up here."
          action="Browse Listings"
          onAction={onBrowse}
        />
      ) : (
        <View style={styles.list}>
          {conversations.map((conv) => {
            const hasUnread = conv.unreadCount > 0;
            return (
              <Pressable
                key={conv.id}
                style={({ pressed }) => [
                  styles.card,
                  hasUnread && styles.cardUnread,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => onOpenConversation(conv)}
              >
                {/* Left: Partner Avatar with online dot */}
                <View style={styles.avatarWrap}>
                  <Image
                    source={{ uri: conv.partnerAvatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.onlineDot} />
                </View>

                {/* Center: Message Details */}
                <View style={styles.details}>
                  <View style={styles.topRow}>
                    <View style={styles.nameGroup}>
                      <Text style={styles.partnerName}>
                        {conv.partnerName}
                      </Text>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    </View>
                    <Text style={styles.timeText}>{conv.time}</Text>
                  </View>

                  {/* Item tag */}
                  <View style={styles.itemTag}>
                    <Text style={styles.itemTagText} numberOfLines={1}>
                      🏷️ {conv.itemTitle} · ${conv.itemPrice}
                    </Text>
                  </View>

                  {/* Last message preview */}
                  <View style={styles.bottomRow}>
                    <Text
                      style={[
                        styles.lastMessage,
                        hasUnread && styles.lastMessageUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {conv.lastMessage}
                    </Text>
                    {hasUnread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                          {conv.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Right: Item thumbnail */}
                <Image
                  source={{ uri: conv.itemImage }}
                  style={styles.itemThumb}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  verifiedCount: {
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  verifiedCountText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
    ...theme.shadows.sm,
  },
  safetyIcon: {
    fontSize: 22,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  safetyDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  list: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
    ...theme.shadows.sm,
  },
  cardUnread: {
    borderColor: theme.colors.accent,
    backgroundColor: "#FDFEFE",
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  details: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "500",
  },
  itemTag: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    maxWidth: 180,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  lastMessage: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  lastMessageUnread: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  unreadBadge: {
    backgroundColor: theme.colors.red,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginLeft: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
});
