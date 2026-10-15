import { StatusBar } from "expo-status-bar";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CampusSelectorModal } from "./components/CampusSelectorModal";
import { ChatModal } from "./components/ChatModal";
import { FilterModal } from "./components/FilterModal";
import { ExplorePage } from "./pages/ExplorePage";
import { MessagesPage } from "./pages/MessagesPage";
import { MyListingsPage } from "./pages/MyListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedPage } from "./pages/SavedPage";
import { initialConversations, seedListings } from "./data";
import { auth, db, firebaseConfigured } from "./firebase";
import { theme } from "./theme";
import { Conversation, FilterOptions, Listing, Tab } from "./types";

async function registerUser(user: User) {
  if (!db) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName:
        user.displayName || user.email?.split("@")[0] || "Campus student",
      email: user.email || "",
      photoURL: user.photoURL || null,
      campus: "North Campus",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Explore");
  const [items, setItems] = useState<Listing[]>(seedListings);
  const [queryText, setQueryText] = useState("");
  const [category, setCategory] = useState("All items");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");
  const [savedIds, setSavedIds] = useState<string[]>(["1", "3"]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  
  // Modals
  const [authOpen, setAuthOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [campusModalOpen, setCampusModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  // Filters
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: "All items",
    sortBy: "popular",
    condition: "All",
    maxPrice: null,
  });

  // Conversations state
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const [authError, setAuthError] = useState("");
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) return;
    const handleUser = (nextUser: User | null) => {
      setUser(nextUser);
      if (nextUser)
        registerUser(nextUser)
          .then(() => setProfileReady(true))
          .catch((error) =>
            setAuthError(
              error instanceof Error
                ? error.message
                : "Could not create profile.",
            ),
          );
      else setProfileReady(false);
    };
    let unsubscribe: () => void = () => undefined;
    setPersistence(firebaseAuth, browserLocalPersistence)
      .then(() => {
        unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
        return getRedirectResult(firebaseAuth);
      })
      .then((result) => {
        if (result?.user) handleUser(result.user);
      })
      .catch((error) =>
        setAuthError(
          error instanceof Error
            ? error.message
            : "Google sign-in could not be completed.",
        ),
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;
    const listingsQuery = query(
      collection(db, "listings"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      listingsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteListings = snapshot.docs.map(
            (entry) => ({ id: entry.id, ...entry.data() }) as Listing,
          );
          setItems([...remoteListings, ...seedListings]);
        }
      },
      () => setItems(seedListings),
    );
  }, []);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory =
          category === "All items" || item.category === category;
        const matchesCampus =
          selectedCampus === "All Campuses" || item.campus === selectedCampus;
        const matchesQuery =
          !queryText ||
          item.title.toLowerCase().includes(queryText.toLowerCase()) ||
          item.category.toLowerCase().includes(queryText.toLowerCase());
        const matchesCondition =
          filterOptions.condition === "All" ||
          item.condition === filterOptions.condition;
        const matchesPrice =
          filterOptions.maxPrice === null ||
          item.price <= filterOptions.maxPrice;

        return (
          matchesCategory &&
          matchesCampus &&
          matchesQuery &&
          matchesCondition &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (filterOptions.sortBy === "price_asc") return a.price - b.price;
        if (filterOptions.sortBy === "price_desc") return b.price - a.price;
        if (filterOptions.sortBy === "newest") return b.id.localeCompare(a.id);
        return (b.likes || 0) - (a.likes || 0); // popular
      });
  }, [items, category, selectedCampus, queryText, filterOptions]);

  const myListings = useMemo(
    () => (user ? items.filter((item) => item.sellerId === user.uid) : []),
    [items, user],
  );

  const toggleSaved = (id: string) =>
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );

  const signInWithGoogle = async () => {
    if (!auth) return;
    setAuthError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      if (Platform.OS === "web") {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        await registerUser(result.user);
        setUser(result.user);
        setProfileReady(true);
        setAuthOpen(false);
      } else {
        await signInAnonymously(auth);
        setAuthOpen(false);
      }
    } catch (error) {
      const code =
        error instanceof Error ? error.message : "Google sign-in failed.";
      if (
        Platform.OS === "web" &&
        /popup|cancelled-popup-request/i.test(code)
      ) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return;
      }
      setAuthError(code);
      Alert.alert("Google sign-in failed", code);
    }
  };

  const publish = async (
    title: string,
    price: string,
    listingCategory: string,
    condition: any,
    campus: string,
    image: string,
    description: string,
  ) => {
    const newListing: Listing = {
      id: "local-" + Date.now(),
      title,
      price: Number(price),
      category: listingCategory,
      seller: user?.displayName || user?.email?.split("@")[0] || "You",
      sellerId: user?.uid,
      sellerRating: 5.0,
      sellerSales: 1,
      campus: campus || "North Campus",
      condition: condition || "Good condition",
      image:
        image ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
      description: description || "Freshly posted listing from campus peer.",
      timeAgo: "Just now",
      likes: 1,
      isNegotiable: true,
    };

    if (user && db) {
      try {
        await addDoc(collection(db, "listings"), {
          ...newListing,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Could not write to remote db, adding locally", err);
      }
    }

    setItems((prev) => [newListing, ...prev]);
    setSellOpen(false);
  };

  const contactSeller = (listing: Listing) => {
    // Look for existing conversation with this seller about this item
    const existing = conversations.find(
      (c) => c.itemTitle === listing.title && c.partnerName === listing.seller,
    );

    if (existing) {
      setActiveChat(existing);
    } else {
      const newConv: Conversation = {
        id: "conv-" + Date.now(),
        partnerName: listing.seller,
        partnerAvatar:
          listing.sellerAvatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        partnerCampus: listing.campus,
        partnerRating: listing.sellerRating || 5.0,
        itemTitle: listing.title,
        itemImage: listing.image,
        itemPrice: listing.price,
        lastMessage: "Started a new inquiry.",
        time: "Just now",
        unreadCount: 0,
        messages: [
          {
            id: "init-1",
            senderId: "system",
            senderName: "Campus Marketplace",
            text: `Inquiry opened for "${listing.title}". Remember to agree on a public campus meetup spot!`,
            timestamp: "Just now",
            isMe: false,
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveChat(newConv);
    }

    setSelectedListing(null);
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              time: "Just now",
              messages: [
                ...c.messages,
                {
                  id: "msg-" + Date.now(),
                  senderId: "user",
                  senderName: "You",
                  text,
                  timestamp: "Just now",
                  isMe: true,
                },
              ],
            }
          : c,
      ),
    );
  };

  const totalUnreadMessages = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  return (
    <View style={styles.desktopOuter}>
      <SafeAreaView style={styles.appContainer}>
        <StatusBar style="dark" />

        {/* Tab Pages */}
        <View style={styles.pageContent}>
          {tab === "Explore" && (
            <ExplorePage
              items={filteredItems}
              query={queryText}
              category={category}
              campus={selectedCampus}
              savedIds={savedIds}
              hasActiveFilters={
                filterOptions.sortBy !== "popular" ||
                filterOptions.condition !== "All" ||
                filterOptions.maxPrice !== null
              }
              onQueryChange={setQueryText}
              onCategoryChange={setCategory}
              onCampusPress={() => setCampusModalOpen(true)}
              onFilterPress={() => setFilterModalOpen(true)}
              onSave={toggleSaved}
              onOpen={setSelectedListing}
              onProfile={() => setTab("Profile")}
            />
          )}

          {tab === "Saved" && (
            <SavedPage
              items={items.filter((item) => savedIds.includes(item.id))}
              onSave={toggleSaved}
              onOpen={setSelectedListing}
              onBrowse={() => setTab("Explore")}
            />
          )}

          {tab === "Messages" && (
            <MessagesPage
              conversations={conversations}
              onOpenConversation={(conv) => setActiveChat(conv)}
              onBrowse={() => setTab("Explore")}
            />
          )}

          {tab === "MyListings" && (
            <MyListingsPage
              items={myListings}
              onOpen={setSelectedListing}
              onSell={() => setSellOpen(true)}
            />
          )}

          {tab === "Profile" && (
            <ProfilePage
              user={user}
              savedCount={savedIds.length}
              listingCount={myListings.length}
              firebaseConfigured={firebaseConfigured}
              profileReady={profileReady}
              error={authError}
              onMyListings={() => (user ? setTab("MyListings") : setAuthOpen(true))}
              onSaved={() => setTab("Saved")}
              onSignIn={() => setAuthOpen(true)}
              onSignOut={() => auth && signOut(auth)}
            />
          )}
        </View>

        {/* Floating / Modern Bottom Navigation Bar */}
        <BottomNav
          tab={tab}
          savedCount={savedIds.length}
          unreadCount={totalUnreadMessages}
          onChange={setTab}
          onSell={() => setSellOpen(true)}
        />

        {/* Listing Detail Bottom Sheet */}
        <ListingDetailModal
          item={selectedListing}
          saved={selectedListing ? savedIds.includes(selectedListing.id) : false}
          onClose={() => setSelectedListing(null)}
          onSave={() => selectedListing && toggleSaved(selectedListing.id)}
          onContact={() => selectedListing && contactSeller(selectedListing)}
        />

        {/* Live Chat Modal */}
        <ChatModal
          conversation={activeChat}
          visible={activeChat !== null}
          onClose={() => setActiveChat(null)}
          onSendMessage={handleSendMessage}
        />

        {/* Campus Location Picker Modal */}
        <CampusSelectorModal
          visible={campusModalOpen}
          selectedCampus={selectedCampus}
          onSelect={setSelectedCampus}
          onClose={() => setCampusModalOpen(false)}
        />

        {/* Filters and Sorting Modal */}
        <FilterModal
          visible={filterModalOpen}
          filters={filterOptions}
          onApply={setFilterOptions}
          onReset={() =>
            setFilterOptions({
              category: "All items",
              sortBy: "popular",
              condition: "All",
              maxPrice: null,
            })
          }
          onClose={() => setFilterModalOpen(false)}
        />

        {/* Auth Modal */}
        <AuthModal
          visible={authOpen}
          onClose={() => setAuthOpen(false)}
          onSignIn={signInWithGoogle}
          error={authError}
        />

        {/* Sell / New Listing Modal */}
        <SellModal
          visible={sellOpen}
          onClose={() => setSellOpen(false)}
          onSubmit={publish}
        />
      </SafeAreaView>
    </View>
  );
}

// ----------------------------------------------------
// Modern Bottom Nav
// ----------------------------------------------------
function BottomNav({
  tab,
  savedCount,
  unreadCount,
  onChange,
  onSell,
}: {
  tab: Tab;
  savedCount: number;
  unreadCount: number;
  onChange: (tab: Tab) => void;
  onSell: () => void;
}) {
  return (
    <View style={styles.navBar}>
      <NavItem
        label="Explore"
        icon="⌂"
        active={tab === "Explore"}
        onPress={() => onChange("Explore")}
      />
      <NavItem
        label="Saved"
        icon="♡"
        active={tab === "Saved"}
        badge={savedCount}
        onPress={() => onChange("Saved")}
      />

      {/* Floating Center Sell Button */}
      <Pressable
        style={({ pressed }) => [
          styles.centerSellButton,
          pressed && styles.centerSellButtonPressed,
        ]}
        onPress={onSell}
      >
        <Text style={styles.centerSellPlus}>＋</Text>
        <Text style={styles.centerSellLabel}>Sell</Text>
      </Pressable>

      <NavItem
        label="Messages"
        icon="□"
        active={tab === "Messages"}
        badge={unreadCount}
        onPress={() => onChange("Messages")}
      />
      <NavItem
        label="Profile"
        icon="○"
        active={tab === "Profile"}
        onPress={() => onChange("Profile")}
      />
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  badge,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <View style={styles.navIconWrapper}>
        <Text style={[styles.navIcon, active && styles.navIconActive]}>
          {icon}
        </Text>
        {badge ? (
          <View style={styles.navBadge}>
            <Text style={styles.navBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.navActiveIndicator} />}
    </Pressable>
  );
}

// ----------------------------------------------------
// Modern Listing Detail Bottom Sheet
// ----------------------------------------------------
function ListingDetailModal({
  item,
  saved,
  onClose,
  onSave,
  onContact,
}: {
  item: Listing | null;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onContact: () => void;
}) {
  if (!item) return null;

  return (
    <Modal visible={item !== null} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.detailSheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Top Image Hero with Floating Controls */}
            <View style={styles.detailHero}>
              <Image source={{ uri: item.image }} style={styles.detailImage} />
              
              {/* Close Button */}
              <Pressable style={styles.detailFloatingClose} onPress={onClose}>
                <Text style={styles.detailFloatingCloseIcon}>✕</Text>
              </Pressable>

              {/* Save Button */}
              <Pressable
                style={[
                  styles.detailFloatingSave,
                  saved && styles.detailFloatingSaveActive,
                ]}
                onPress={onSave}
              >
                <Text
                  style={[
                    styles.detailFloatingHeart,
                    saved && styles.detailFloatingHeartActive,
                  ]}
                >
                  {saved ? "♥" : "♡"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.detailBody}>
              {/* Tags row */}
              <View style={styles.detailTagsRow}>
                <View style={styles.detailCategoryTag}>
                  <Text style={styles.detailCategoryText}>
                    {item.category.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.detailConditionTag}>
                  <Text style={styles.detailConditionText}>
                    {item.condition}
                  </Text>
                </View>
                {item.isNegotiable && (
                  <View style={styles.detailOboTag}>
                    <Text style={styles.detailOboText}>Price Negotiable</Text>
                  </View>
                )}
              </View>

              {/* Title & Price */}
              <Text style={styles.detailTitle}>{item.title}</Text>
              <View style={styles.detailPriceRow}>
                <Text style={styles.detailPrice}>${item.price}</Text>
                {item.originalPrice ? (
                  <Text style={styles.detailOriginalPrice}>
                    ${item.originalPrice} retail
                  </Text>
                ) : null}
              </View>

              {/* Campus Location */}
              <View style={styles.detailLocationRow}>
                <Text style={styles.detailLocationText}>
                  📍 Available for pickup at {item.campus}
                </Text>
              </View>

              {/* Seller Verification Card */}
              <View style={styles.sellerCard}>
                {item.sellerAvatar ? (
                  <Image
                    source={{ uri: item.sellerAvatar }}
                    style={styles.sellerCardAvatar}
                  />
                ) : (
                  <View style={styles.sellerCardFallback}>
                    <Text style={styles.sellerCardInitial}>
                      {item.seller[0]?.toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.sellerCardInfo}>
                  <View style={styles.sellerCardNameRow}>
                    <Text style={styles.sellerCardName}>{item.seller}</Text>
                    <View style={styles.sellerVerifiedBadge}>
                      <Text style={styles.sellerVerifiedCheck}>✓</Text>
                    </View>
                  </View>
                  <Text style={styles.sellerCardMeta}>
                    ★ {item.sellerRating || "5.0"} · {item.sellerSales || "10+"}{" "}
                    campus sales · ⚡ Fast replies
                  </Text>
                </View>
              </View>

              {/* Safety banner */}
              <View style={styles.safeMeetupBanner}>
                <Text style={styles.safeMeetupIcon}>🛡️</Text>
                <View style={styles.safeMeetupContent}>
                  <Text style={styles.safeMeetupTitle}>
                    Campus Safe Meetup Spot
                  </Text>
                  <Text style={styles.safeMeetupDesc}>
                    Meet inside the Student Center, Library front desk, or
                    dining hall.
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.detailSectionTitle}>Item Description</Text>
              <Text style={styles.detailDescription}>
                {item.description || "No additional description provided."}
              </Text>
            </View>
          </ScrollView>

          {/* Sticky Bottom Actions */}
          <View style={styles.detailFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.chatActionBtn,
                pressed && styles.buttonPressed,
              ]}
              onPress={onContact}
            >
              <Text style={styles.chatActionText}>
                💬 Message {item.seller}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ----------------------------------------------------
// Modern Sell Modal
// ----------------------------------------------------
function SellModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    price: string,
    category: string,
    condition: any,
    campus: string,
    image: string,
    description: string,
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [condition, setCondition] = useState<any>("Like new");
  const [campus, setCampus] = useState("North Campus");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
  );

  const samplePhotos = [
    {
      label: "Textbook",
      url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    },
    {
      label: "Gadget",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    },
    {
      label: "Furniture",
      url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    },
    {
      label: "Fashion",
      url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
    },
  ];

  const categories = [
    "Textbooks",
    "Tech",
    "Furniture",
    "Fashion",
    "Mobility",
    "Supplies",
  ];

  const conditions = ["Brand new", "Like new", "Good condition", "Fair"];

  const handlePublish = () => {
    if (!title || !price) return;
    onSubmit(
      title,
      price,
      category,
      condition,
      campus,
      selectedImage,
      description,
    );
    setTitle("");
    setPrice("");
    setDescription("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.sellSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sellHeader}>
            <View>
              <Text style={styles.sellTitle}>List an Item</Text>
              <Text style={styles.sellSubtitle}>
                Sell quickly to fellow campus students
              </Text>
            </View>
            <Pressable style={styles.sheetClose} onPress={onClose}>
              <Text style={styles.sheetCloseIcon}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Choose cover photo */}
            <Text style={styles.fieldLabel}>CHOOSE COVER PHOTO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photosRow}>
                {samplePhotos.map((photo, i) => {
                  const active = selectedImage === photo.url;
                  return (
                    <Pressable
                      key={i}
                      style={[
                        styles.photoSample,
                        active && styles.photoSampleActive,
                      ]}
                      onPress={() => setSelectedImage(photo.url)}
                    >
                      <Image
                        source={{ uri: photo.url }}
                        style={styles.photoSampleImg}
                      />
                      <Text style={styles.photoSampleLabel}>{photo.label}</Text>
                      {active && (
                        <View style={styles.photoCheck}>
                          <Text style={styles.photoCheckIcon}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Title */}
            <Text style={styles.fieldLabel}>TITLE</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Calculus 8th Edition + Solution manual"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.inputField}
            />

            {/* Price */}
            <Text style={styles.fieldLabel}>PRICE ($)</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.dollarSymbol}>$</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="25"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.priceInputField}
              />
            </View>

            {/* Category selection */}
            <Text style={styles.fieldLabel}>CATEGORY</Text>
            <View style={styles.chipsRow}>
              {categories.map((cat) => {
                const active = category === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Condition selection */}
            <Text style={styles.fieldLabel}>CONDITION</Text>
            <View style={styles.chipsRow}>
              {conditions.map((cond) => {
                const active = condition === cond;
                return (
                  <Pressable
                    key={cond}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCondition(cond)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {cond}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Meetup Campus Area */}
            <Text style={styles.fieldLabel}>CAMPUS MEETUP LOCATION</Text>
            <TextInput
              value={campus}
              onChangeText={setCampus}
              placeholder="e.g. North Campus / Central Library"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.inputField}
            />

            {/* Description */}
            <Text style={styles.fieldLabel}>DESCRIPTION</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details about condition, notes, or where to meet..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={3}
              style={[styles.inputField, styles.textArea]}
            />

            <Pressable
              disabled={!title || !price}
              style={[
                styles.publishBtn,
                (!title || !price) && styles.publishBtnDisabled,
              ]}
              onPress={handlePublish}
            >
              <Text style={styles.publishBtnText}>Publish to Campus 🚀</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ----------------------------------------------------
// Modern Auth Modal
// ----------------------------------------------------
function AuthModal({
  visible,
  onClose,
  onSignIn,
  error,
}: {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  error: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.authCard}>
          <Text style={styles.authLogo}>🎓</Text>
          <Text style={styles.authTitle}>Campus Marketplace</Text>
          <Text style={styles.authDesc}>
            Join your student community to buy, sell, and trade safely on
            campus.
          </Text>

          {error ? <Text style={styles.authError}>{error}</Text> : null}

          <Pressable style={styles.googleBtn} onPress={onSignIn}>
            <Text style={styles.googleLogo}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Student Google</Text>
          </Pressable>

          <Pressable style={styles.laterBtn} onPress={onClose}>
            <Text style={styles.laterBtnText}>Explore as Guest</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ----------------------------------------------------
// Master Stylesheet
// ----------------------------------------------------
const styles = StyleSheet.create({
  desktopOuter: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  appContainer: {
    width: "100%",
    maxWidth: 480,
    height: "100%",
    backgroundColor: theme.colors.background,
    overflow: "hidden",
    position: "relative",
    ...theme.shadows.lg,
  },
  pageContent: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  // Bottom Navigation Bar
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    ...theme.shadows.md,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 54,
    height: "100%",
    position: "relative",
  },
  navIconWrapper: {
    position: "relative",
  },
  navIcon: {
    fontSize: 22,
    color: theme.colors.textMuted,
  },
  navIconActive: {
    color: theme.colors.primary,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  navActiveIndicator: {
    position: "absolute",
    bottom: 4,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  navBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: theme.colors.red,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  navBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  centerSellButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -8,
    ...theme.shadows.glow,
  },
  centerSellButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  centerSellPlus: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  centerSellLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  // Modals & Sheets Backdrop
  modalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  // Listing Detail Modal
  detailSheet: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "90%",
    overflow: "hidden",
  },
  detailHero: {
    width: "100%",
    height: 280,
    backgroundColor: theme.colors.primarySoft,
    position: "relative",
  },
  detailImage: {
    width: "100%",
    height: "100%",
  },
  detailFloatingClose: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  detailFloatingCloseIcon: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  detailFloatingSave: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  detailFloatingSaveActive: {
    backgroundColor: theme.colors.redLight,
  },
  detailFloatingHeart: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginTop: -1,
  },
  detailFloatingHeartActive: {
    color: theme.colors.red,
  },
  detailBody: {
    padding: 20,
  },
  detailTagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  detailCategoryTag: {
    backgroundColor: theme.colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
  },
  detailCategoryText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  detailConditionTag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailConditionText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },
  detailOboTag: {
    backgroundColor: theme.colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.xs,
  },
  detailOboText: {
    color: theme.colors.gold,
    fontSize: 10,
    fontWeight: "800",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    lineHeight: 28,
  },
  detailPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 6,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  detailOriginalPrice: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textDecorationLine: "line-through",
  },
  detailLocationRow: {
    marginTop: 8,
    marginBottom: 16,
  },
  detailLocationText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
    marginBottom: 16,
  },
  sellerCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sellerCardFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerCardInitial: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  sellerCardInfo: {
    flex: 1,
  },
  sellerCardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sellerCardName: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  sellerVerifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerVerifiedCheck: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  sellerCardMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  safeMeetupBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  safeMeetupIcon: {
    fontSize: 20,
  },
  safeMeetupContent: {
    flex: 1,
  },
  safeMeetupTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  safeMeetupDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  detailFooter: {
    padding: 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  chatActionBtn: {
    height: 50,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  chatActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Sell Sheet
  sellSheet: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "90%",
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sellHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sellTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.textPrimary,
  },
  sellSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCloseIcon: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 8,
  },
  photosRow: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 4,
  },
  photoSample: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },
  photoSampleActive: {
    borderColor: theme.colors.accent,
  },
  photoSampleImg: {
    width: "100%",
    height: "100%",
  },
  photoSampleLabel: {
    position: "absolute",
    bottom: 2,
    left: 2,
    right: 2,
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.6)",
    textAlign: "center",
    borderRadius: 4,
  },
  photoCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  photoCheckIcon: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  inputField: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  priceInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    height: 48,
  },
  dollarSymbol: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.textMuted,
    marginRight: 6,
  },
  priceInputField: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  publishBtn: {
    marginTop: 24,
    height: 50,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  publishBtnDisabled: {
    opacity: 0.45,
  },
  publishBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Auth Card
  authCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: 24,
    margin: 20,
    alignItems: "center",
    ...theme.shadows.lg,
  },
  authLogo: {
    fontSize: 44,
    marginBottom: 8,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  authDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 280,
  },
  authError: {
    color: theme.colors.red,
    backgroundColor: theme.colors.redLight,
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 50,
    width: "100%",
    borderRadius: theme.radius.full,
    marginTop: 20,
    gap: 10,
    ...theme.shadows.sm,
  },
  googleLogo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4285F4",
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  laterBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  laterBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
});
