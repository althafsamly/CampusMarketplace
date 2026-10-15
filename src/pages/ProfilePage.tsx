import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { User } from "firebase/auth";
import { PageTitle } from "../components/PageTitle";
import { theme } from "../theme";

export function ProfilePage({
  user,
  savedCount,
  listingCount,
  firebaseConfigured,
  profileReady,
  error,
  onMyListings,
  onSaved,
  onSignIn,
  onSignOut,
}: {
  user: User | null;
  savedCount: number;
  listingCount: number;
  firebaseConfigured: boolean;
  profileReady: boolean;
  error: string;
  onMyListings: () => void;
  onSaved: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const name =
    user?.displayName || user?.email?.split("@")[0] || "Campus Student";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageTitle
        title="Student Profile"
        subtitle="Your campus credentials and marketplace activity"
      />

      {/* Digital Campus Student ID Card */}
      <View style={styles.idCard}>
        <View style={styles.idCardHeader}>
          <Text style={styles.idCardUniversity}>CAMPUS VERIFIED ID</Text>
          <View style={styles.verifiedChip}>
            <Text style={styles.verifiedCheck}>✓</Text>
            <Text style={styles.verifiedChipText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.initials}>{initials || "🎓"}</Text>
              </View>
            )}
            <View style={styles.avatarOnlineDot} />
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>
              {user?.email || "Student Account (Demo)"}
            </Text>
            <View style={styles.campusTag}>
              <Text style={styles.campusTagText}>📍 North Campus · Class of '27</Text>
            </View>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <Pressable style={styles.statItem} onPress={onMyListings}>
            <Text style={styles.statVal}>{listingCount}</Text>
            <Text style={styles.statLbl}>Listings</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <Pressable style={styles.statItem} onPress={onSaved}>
            <Text style={styles.statVal}>{savedCount}</Text>
            <Text style={styles.statLbl}>Saved</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>5.0 ★</Text>
            <Text style={styles.statLbl}>Reputation</Text>
          </View>
        </View>
      </View>

      {/* Settings & Navigation Menu */}
      <View style={styles.menuCard}>
        <MenuRow
          icon="📦"
          label="My Active Listings"
          value={`${listingCount} items`}
          onPress={onMyListings}
        />
        <MenuRow
          icon="♥"
          label="Saved Wishlist"
          value={`${savedCount} items`}
          onPress={onSaved}
        />
        <MenuRow
          icon="🛡️"
          label="Campus Meetup Safe Spots"
          value="Student Union / Library"
        />
        <MenuRow
          icon="⚡"
          label="Instant Notifications"
          value="Enabled"
        />
      </View>

      {/* Status & Errors */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {user && profileReady ? (
        <View style={styles.syncedBanner}>
          <Text style={styles.syncedText}>✓ Synced to Firestore Database</Text>
        </View>
      ) : null}

      {/* Auth Action */}
      {user ? (
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignOut}
        >
          <Text style={styles.signOutText}>Sign Out of Campus ID</Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.signInButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onSignIn}
        >
          <Text style={styles.signInText}>Sign In with Google Campus Account</Text>
        </Pressable>
      )}

      {/* Firebase connection badge */}
      <View style={styles.firebaseFooter}>
        <View
          style={[
            styles.firebaseDot,
            firebaseConfigured && styles.firebaseDotConnected,
          ]}
        />
        <Text style={styles.firebaseText}>
          {firebaseConfigured
            ? "Firebase Live Connected"
            : "Demo Mode (Mock Data Active)"}
        </Text>
      </View>
    </ScrollView>
  );
}

function MenuRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        <Text style={styles.rowChevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  idCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
    marginTop: 6,
    marginBottom: 16,
  },
  idCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  idCardUniversity: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: theme.colors.primary,
  },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  verifiedCheck: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "900",
  },
  verifiedChipText: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: "800",
  },
  avatarOnlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.accent,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  email: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  campusTag: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  campusTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  menuCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
    marginBottom: 20,
  },
  row: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowIcon: {
    fontSize: 16,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  rowChevron: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },
  signInButton: {
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  signOutButton: {
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.redLight,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: theme.colors.red,
    fontSize: 14,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  syncedBanner: {
    backgroundColor: theme.colors.primaryMuted,
    padding: 10,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    marginBottom: 16,
  },
  syncedText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  error: {
    color: theme.colors.red,
    backgroundColor: theme.colors.redLight,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    marginBottom: 16,
  },
  firebaseFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  firebaseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.gold,
  },
  firebaseDotConnected: {
    backgroundColor: theme.colors.accent,
  },
  firebaseText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
});
