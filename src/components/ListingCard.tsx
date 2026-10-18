import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Listing } from "../types";

export function ListingCard({
  item,
  saved,
  onSave,
  onOpen,
  onMarkSold,
}: {
  item: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
  onMarkSold?: () => void;
}) {
  const discount =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onOpen}
    >
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Sold out overlay */}
        {item.sold && (
          <View style={styles.soldOverlay}>
            <View style={styles.soldPill}>
              <Text style={styles.soldPillText}>SOLD OUT</Text>
            </View>
          </View>
        )}

        {/* Condition floating badge */}
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>

        {/* Discount badge if available */}
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}

        {/* Heart / Save floating button */}
        <Pressable
          accessibilityLabel={saved ? "Remove from saved" : "Save item"}
          style={({ pressed }) => [
            styles.saveButton,
            saved && styles.saveButtonActive,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={(e) => {
            e.stopPropagation?.();
            onSave();
          }}
        >
          <Text style={[styles.heartIcon, saved && styles.heartIconActive]}>
            {saved ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      {/* Card body */}
      <View style={styles.body}>
        {/* Price & original price */}
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>${item.price}</Text>
            {item.originalPrice ? (
              <Text style={styles.originalPrice}>${item.originalPrice}</Text>
            ) : null}
          </View>
          {item.isNegotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableText}>OBO</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Campus location and time */}
        <View style={styles.metaRow}>
          <Text style={styles.location} numberOfLines={1}>
            📍 {item.campus}
          </Text>
        </View>

        {/* Seller info footer */}
        <View style={styles.sellerRow}>
          {item.sellerAvatar ? (
            <Image
              source={{ uri: item.sellerAvatar }}
              style={styles.sellerAvatar}
            />
          ) : (
            <View style={styles.sellerAvatarFallback}>
              <Text style={styles.sellerInitial}>
                {item.seller[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.sellerName} numberOfLines={1}>
            {item.seller}
          </Text>
          {item.sellerRating ? (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{item.sellerRating}</Text>
            </View>
          ) : null}
        </View>

        {/* Mark as Sold (seller only) */}
        {onMarkSold && !item.sold && (
          <Pressable
            style={({ pressed }) => [
              styles.markSoldButton,
              pressed && styles.cardPressed,
            ]}
            onPress={(e) => {
              e.stopPropagation?.();
              onMarkSold();
            }}
          >
            <Text style={styles.markSoldText}>✓ Mark as Sold</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 36, 29, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  soldPill: {
    backgroundColor: theme.colors.red,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.xs,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "-12deg" }],
  },
  soldPillText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  markSoldButton: {
    marginTop: 6,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
  },
  markSoldText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.15,
    backgroundColor: theme.colors.primarySoft,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  conditionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(15, 36, 29, 0.72)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  conditionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  discountBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: theme.colors.orange,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  saveButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  saveButtonActive: {
    backgroundColor: theme.colors.redLight,
  },
  saveButtonPressed: {
    transform: [{ scale: 1.15 }],
  },
  heartIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginTop: -1,
  },
  heartIconActive: {
    color: theme.colors.red,
  },
  body: {
    padding: 10,
    gap: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceGroup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  originalPrice: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  negotiableBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  negotiableText: {
    color: theme.colors.primaryLight,
    fontSize: 9,
    fontWeight: "800",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
    height: 34,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    gap: 6,
  },
  sellerAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  sellerAvatarFallback: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerInitial: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "800",
  },
  sellerName: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingStar: {
    color: theme.colors.gold,
    fontSize: 10,
  },
  ratingText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },
});
