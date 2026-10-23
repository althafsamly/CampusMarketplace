# 🎓 Campus Marketplace

> A student-only marketplace for buying, selling, and trading within a trusted university community.

Campus Marketplace is a modern mobile and web marketplace built specifically for university students. It provides a safe and convenient environment where students can discover, sell, save, and discuss items such as textbooks, electronics, dorm furniture, fashion, mobility products, and academic supplies.

The application was developed as part of a **Group Software Development Project**, using **React Native, Expo, TypeScript, and Firebase Cloud Firestore**.

---

## 📌 Project Information

| | |
|---|---|
| Project | Campus Marketplace |
| **Project Type** | Group Software Development Project |
| **Platform** | Web & Mobile |
| **Framework** | React Native + Expo |
| **Backend** | Firebase |
| **Database** | Cloud Firestore |
| **Language** | TypeScript |
| **Repository** | [Campus Marketplace](https://github.com/althafsamly/CampusMarketplace) |
| **Upstream Base** | [Campus Marketplace – Webtegy](https://github.com/webtegy/campus-marketplace) |
| **Video Demonstration** | *Add your 5–8 minute video demonstration link here* |

---

# 👥 Group Members & Contributions

| Registration No. | Student Name | Assigned Role | Key Contributions |
|---|---|---|---|
| **2023/CSC/011** | **B. Althaf Samly** | Team Lead & Full-Stack Architect | Project architecture and scaffolding, Firebase integration, authentication lifecycle, Firestore security rules, and application coordinator state |
| **2023/CSC/038** | **K.G.D.N. Kotuwegedara** | Frontend & Search Engineer | Enhanced search and filtering, keyword search across listings, seller search, and campus selector integration |
| **2023/CSC/038** | **K.D.M.G.S. Dissanayaka** | UI/UX & Filtering Engineer | Dynamic price filtering, price preset chips, active filter tags, instant filter reset, and condition filtering |
| **2023/CSC/012** | **V. Amasha Chathumini** | Inventory & Dashboard Engineer | Mark-as-sold lifecycle, sold-out overlays, listing status management, and seller dashboard statistics |
| **2023/CSC/031** | **J.B.U.L. Nayanashan** | Messaging & Wishlist Engineer | Saved wishlist, buyer-seller conversations, chat interface, campus safety guidelines, and project documentation |

> **Note:** Please verify the duplicated registration number `2023/CSC/038` before submitting the final repository.

---

# ✨ Key Features

## 🔎 1. Real-Time Search & Multi-Criteria Filtering

The marketplace provides a fast and flexible discovery experience for students.

### Features

- 🔍 Keyword search across:
  - Listing titles
  - Descriptions
  - Categories
  - Campuses
  - Seller names
- 🏫 Campus-based filtering
- 📚 Category filtering
- ⚡ Instant client-side filtering using React's `useMemo`
- 🎯 Multiple filters can be combined

### Supported Categories

- 📖 Textbooks
- 💻 Tech
- 🛋️ Furniture
- 👕 Fashion
- 🚲 Mobility
- ✏️ Supplies

### Campus Locations

Example campus locations include:

- North Campus
- West Village
- Central Quad
- Science Hill

### Main Components

```text
src/pages/ExplorePage.tsx
src/components/CampusSelectorModal.tsx
```

### Git Branch

```text
feature/enhanced-listing-search
```

**Pull Request:** `#2`

---

# 💰 2. Dynamic Price Filtering & Active Filter Tags

Students can quickly narrow down listings based on their preferred budget.

### Price Presets

| Price Range | Filter |
|---|---|
| All Prices | No price restriction |
| Under $25 | `$0 – $24.99` |
| $25–$50 | `$25 – $50` |
| $50–$100 | `$50 – $100` |
| $100–$200 | `$100 – $200` |
| $200+ | `$200 and above` |

### Additional Features

- 🏷️ Active filter badges
- ❌ One-click filter removal
- 🔄 Reset All functionality
- 📊 Multiple sorting options
- ⚡ Instant filtering without unnecessary navigation

### Sorting Options

- Most Popular
- Newest First
- Price: Low to High
- Price: High to Low

### Main Components

```text
src/components/FilterModal.tsx
src/data.ts
```

### Git Branch

```text
feature/price-filter
```

**Pull Request:** `#5`

---

# ✅ 3. Mark as Sold & Seller Dashboard

The listing lifecycle has been extended to support completed transactions.

### Mark as Sold

Sellers can mark their listings as sold from:

- Listing detail view
- My Listings dashboard

Once a listing is sold:

- A prominent **SOLD OUT** badge is displayed.
- The listing status is updated.
- Buyer inquiries are disabled.
- Sold items are visually distinguished throughout the application.

### 📊 Seller Dashboard

Sellers can monitor important inventory statistics, including:

- Active inventory count
- Total inventory valuation
- Response rate

### Main Components

```text
src/pages/MyListingsPage.tsx
src/components/ListingCard.tsx
```

### Git Branch

```text
sold-out-feature
```

**Pull Request:** `#4`

---

# ❤️ 4. Saved Wishlist & Buyer-Seller Messaging

Students can save interesting listings and communicate directly with sellers.

## ❤️ Saved Wishlist

Users can:

- Save listings with a single tap
- Remove saved listings
- View all saved listings from the Saved tab
- Keep their saved items synchronized with their account

## 💬 In-App Messaging

The application provides direct buyer-seller communication.

Features include:

- Conversation threads
- Buyer-to-seller messaging
- Listing context associated with conversations
- Pre-filled listing information when starting a conversation
- Seller/buyer identification
- Prevention of sellers contacting themselves

## 🛡️ Campus Safety

Safety reminders are displayed to encourage students to meet in appropriate public locations, such as:

- Student Union
- Library Café
- Central Quad

### Main Components

```text
src/pages/SavedPage.tsx
src/pages/MessagesPage.tsx
src/components/ChatModal.tsx
```

---

# 🏗️ System Architecture

The application follows a client-based architecture using React Native and Firebase.

```text
┌──────────────────────────────────────┐
│          React Native / Expo         │
│                                      │
│  ┌────────────┐    ┌─────────────┐  │
│  │   Pages    │    │ Components  │  │
│  └─────┬──────┘    └──────┬──────┘  │
│        │                  │         │
│        └─────────┬────────┘         │
│                  │                  │
│          Application State         │
│                  │                  │
└──────────────────┼──────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │       Firebase      │
        │                     │
        │ ┌─────────────────┐ │
        │ │ Authentication  │ │
        │ └─────────────────┘ │
        │                     │
        │ ┌─────────────────┐ │
        │ │ Cloud Firestore │ │
        │ └─────────────────┘ │
        └─────────────────────┘
```

---

# 🛠️ Technology Stack

| Technology | Version / Purpose |
|---|---|
| **React Native** | `0.86.2` |
| **Expo** | SDK `57` |
| **TypeScript** | `6.0.3` |
| **Firebase** | `12.18.0` |
| **Cloud Firestore** | Database |
| **Firebase Authentication** | User authentication |
| **React DOM** | `19.2.3` |
| **React Native Web** | `0.21.2` |
| **@expo/vector-icons** | Application icons |
| **StyleSheet** | Native styling and design system |

### Design System

The application uses a unified React Native `StyleSheet`-based design system.

```text
src/theme.ts
```

This allows colors, typography, spacing, and other design values to remain consistent throughout the application.

---

# 🚀 Getting Started

Follow the steps below to run the project locally.

## Prerequisites

Make sure the following software is installed:

- **Node.js:** `v22.13.0` or newer
- **npm:** `v10.8.0` or newer

The project has also been verified with:

```text
Node.js v24.18.0
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/althafsamly/CampusMarketplace.git
cd CampusMarketplace
```

---

## 2. Configure Environment Variables

Copy the example environment file.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

> The application can automatically operate in **offline demo mode** when custom Firebase credentials are not provided.

---

## 3. Install Dependencies

```bash
npm install
```

---

# ▶️ Running the Application

## Option A — Web Browser

The web version is recommended for project evaluation.

```bash
npm run web
```

Alternatively:

```bash
npx expo start --web
```

The application should become available at:

```text
http://localhost:8081
```

---

## Option B — Mobile with Expo Go

Start the Expo development server:

```bash
npm start
```

Then:

1. Install **Expo Go** on your Android or iOS device.
2. Make sure your phone and development computer are connected to the same network.
3. Scan the QR code displayed in the terminal.
4. Open the project through Expo Go.

---

## Option C — Type Checking & Configuration Verification

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Verify the Expo configuration:

```bash
npx expo config --type public
```

---

# 🔐 Security & Data Architecture

Security and controlled access are important parts of Campus Marketplace.

## Guest Browsing

Unauthenticated users can:

- Browse listings
- Search the marketplace
- Apply filters
- Explore available campus inventory

## Authenticated Interactions

Authentication is required for actions such as:

- Publishing listings
- Contacting sellers
- Managing saved listings
- Managing personal listings

Users are prompted to authenticate before accessing protected functionality.

---

## 🔒 Firestore Security

Firestore security rules restrict users from modifying data that does not belong to them.

For example, sellers can only manage their own listings using their authenticated user ID:

```text
sellerId == auth.uid
```

The primary security configuration is located at:

```text
firestore.rules
```

---

## 🗄️ Firestore Collections

The application uses Firestore collections for:

```text
listings
users
users/{uid}/saved
conversations
```

These collections support the marketplace, authentication-related user data, saved items, and buyer-seller communication.

---

## ⚡ Compound Indexing

Firestore compound indexes are defined in:

```text
firestore.indexes.json
```

The project includes indexing for operations such as:

```text
sellerId ASC
createdAt DESC
```

This supports efficient seller-specific listing queries combined with chronological sorting.

---

# 🌿 Git Collaboration Strategy

The development team used a feature-branch workflow to separate development tasks and integrate changes through Pull Requests.

## Main Branch

```text
main
```

Contains the stable, production-ready version of the application.

## Feature Branches

### Enhanced Search

```text
feature/enhanced-listing-search
```

Implemented:

- Keyword search
- Category filtering
- Campus filtering

**PR #2**

---

### Sold-Out Feature

```text
sold-out-feature
```

Implemented:

- Mark as Sold functionality
- Sold-out badges
- Listing lifecycle management

**PR #4**

---

### Price Filter

```text
feature/price-filter
```

Implemented:

- Price ranges
- Price preset chips
- Active filter tags
- Filter reset functionality

**PR #5**

---

### UI Improvements

```text
feature/ui-improvements
```

Implemented various interface improvements, including:

- Theme refinements
- ID card profile
- Empty states
- General UI polishing

---

# 📁 Project Structure

A simplified overview of the project structure:

```text
CampusMarketplace/
│
├── src/
│   ├── components/
│   │   ├── CampusSelectorModal.tsx
│   │   ├── ChatModal.tsx
│   │   ├── FilterModal.tsx
│   │   └── ListingCard.tsx
│   │
│   ├── pages/
│   │   ├── ExplorePage.tsx
│   │   ├── SavedPage.tsx
│   │   ├── MessagesPage.tsx
│   │   └── MyListingsPage.tsx
│   │
│   ├── theme.ts
│   └── data.ts
│
├── firestore.rules
├── firestore.indexes.json
├── .env.example
├── package.json
└── README.md
```

---

# 🎯 Project Objectives

The main objectives of Campus Marketplace are to:

- Provide a dedicated marketplace for university students.
- Make buying and selling within a campus community easier.
- Provide fast search and filtering capabilities.
- Enable secure buyer-seller communication.
- Allow students to save listings for later.
- Provide sellers with useful inventory statistics.
- Encourage safer in-person transactions.
- Demonstrate practical use of modern mobile application development technologies.

---

# 🧪 Testing & Verification

Before submission, the following commands can be used to verify the project:

```bash
npm install
```

```bash
npx tsc --noEmit
```

```bash
npx expo config --type public
```

```bash
npm run web
```

The application should successfully compile and run in the browser without TypeScript errors.

---

# 🎥 Video Demonstration

> **Add your final 5–8 minute demonstration video here.**

Example:

```text
🎥 Video Demo: [Add YouTube / Google Drive Link]
```

The demonstration should cover:

1. Application overview
2. User authentication
3. Browsing listings
4. Search and filtering
5. Price filtering
6. Creating/managing listings
7. Mark as Sold functionality
8. Saved wishlist
9. Buyer-seller messaging
10. Security and Firebase functionality

---

# 📸 Screenshots

Add screenshots of the completed application here to make the repository easier to evaluate.

Recommended screenshots:

| Screenshot | Description |
|---|---|
| 🏠 Home / Explore | Marketplace landing and listing feed |
| 🔎 Search | Keyword search and filtering |
| 💰 Filters | Price and category filters |
| 📄 Listing Details | Individual product details |
| ❤️ Saved | User's saved listings |
| 💬 Messages | Buyer-seller conversation |
| 📦 My Listings | Seller inventory dashboard |
| ✅ Sold | Sold-out listing state |
| 👤 Profile | User profile and account |

Example structure:

```text
docs/
├── screenshots/
│   ├── home.png
│   ├── search.png
│   ├── filters.png
│   ├── listing-details.png
│   ├── saved.png
│   ├── messages.png
│   └── my-listings.png
```

---

# 🔗 Repository Links

### Main Repository

[github.com/althafsamly/CampusMarketplace](https://github.com/althafsamly/CampusMarketplace)

### Upstream Project

[github.com/webtegy/campus-marketplace](https://github.com/webtegy/campus-marketplace)

---

# 📚 Academic Context

This application was developed as part of a **Group Software Development Project**.

The project demonstrates practical application of:

- Software architecture
- Mobile application development
- TypeScript
- React Native
- Expo
- Firebase Authentication
- Cloud Firestore
- Database security rules
- Client-side state management
- Search and filtering algorithms
- UI/UX design
- Git and GitHub collaboration
- Feature branching
- Pull Request-based development

---

# 👨‍💻 Development Team

**Campus Marketplace Team**

Built with ❤️ by university students, for university students.

---

## 📄 License

This project was developed for academic and educational purposes as part of a university group software development project.
