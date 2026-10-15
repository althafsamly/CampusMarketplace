export type Listing = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  seller: string;
  sellerId?: string;
  sellerAvatar?: string;
  sellerRating?: number;
  sellerSales?: number;
  campus: string;
  condition: "Brand new" | "Like new" | "Good condition" | "Fair";
  image: string;
  description?: string;
  createdAt?: any;
  timeAgo?: string;
  likes?: number;
  isNegotiable?: boolean;
};

export type Tab = "Explore" | "Saved" | "Messages" | "Profile" | "MyListings";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
};

export type Conversation = {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  partnerCampus: string;
  partnerRating: number;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
};

export type FilterOptions = {
  category: string;
  sortBy: "popular" | "newest" | "price_asc" | "price_desc";
  condition: string;
  maxPrice: number | null;
};
