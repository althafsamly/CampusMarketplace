# 🎓 Campus Marketplace

> **A modern, student-only marketplace for buying, selling, and trading within a trusted university community.**

Campus Marketplace is a student-focused marketplace application designed to help university students safely buy, sell, save, and communicate about items within their campus community.

The platform supports a range of student needs, including **textbooks, electronics, dorm furniture, fashion, mobility products, and academic supplies**.

The project was developed as part of a **Group Software Development Project** using **React Native, Expo SDK 57, TypeScript, and Firebase Cloud Firestore**.

---

## 📌 Project Information

| | |
|---|---|
| **Project** | Campus Marketplace |
| **Project Type** | Group Software Development Project |
| **Platform** | Web & Mobile |
| **Framework** | React Native |
| **Expo** | SDK 57 |
| **Language** | TypeScript |
| **Backend** | Firebase |
| **Database** | Cloud Firestore |
| **Authentication** | Firebase Authentication / Google OAuth |
| **Repository** | [CampusMarketplace](https://github.com/althafsamly/CampusMarketplace) |
| **Upstream Base** | [webtegy/campus-marketplace](https://github.com/webtegy/campus-marketplace) |
| **Video Demonstration** | *Add your final 5–8 minute video link here* |

---

# 👥 Group Members & Contributions

| Registration No. | Student Name | Assigned Role | Key Contributions |
|---|---|---|---|
| **2023/CSC/011** | **B. Althaf Samly** |  Full-Stack Architect | Project architecture and scaffolding; Firebase integration; authentication lifecycle; Firestore security rules; application coordinator state; Saved favorites wishlist; in-app chat threads; campus safety guidelines; and seller messaging functionality. |
| **2023/CSC/094** | **K.G.D.N. Kotuwegedara** | Inventory & Dashboard | Mark as Sold lifecycle; listing status toggle; sold-out overlay badges across listing cards and detail views; seller dashboard inventory metrics. |
| **2023/CSC/038** | **K.D.M.G.S. Dissanayaka** | Filtering & Pricing  | Dynamic price filtering; price bracket preset chips; active filter tags; instant filter reset; and condition filters. |
| **2023/CSC/012** | **V. Amasha Chathumini** | Search & Discovery  | Enhanced listing search; keyword matching across titles, descriptions, categories, and sellers; campus location selector modal; and category tabs. |
| **2023/CSC/031** | **J.B.U.L. Nayanashan** | UI/UX & Design Systems  | UI/UX improvements; unified theme tokens; verified digital student ID card component; contextual empty states; and project documentation. |

---

# 🚀 Key Features

Our team implemented four major feature enhancements to significantly improve the functionality, usability, and safety of the original marketplace application.

---

## 🔎 1. Real-Time Search & Multi-Criteria Filtering

The marketplace provides a fast and flexible search experience that allows students to quickly discover relevant listings.

### Features

- 🔍 **Keyword Search** across:
  - Item titles
  - Descriptions
  - Categories
  - Campuses
  - Seller names

- 🏫 **Campus Location Filtering**
- 📚 **Category Filtering**
- ⚡ **Memoized Client-Side Filtering** using `useMemo`
- 🎯 Multiple filtering criteria can be combined

### Supported Categories

- 📖 Textbooks
- 💻 Tech
- 🛋️ Furniture
- 👕 Fashion
- 🚲 Mobility
- ✏️ Supplies

### Example Campus Locations

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

Students can quickly narrow down marketplace listings according to their preferred budget.

### Price Presets

| Preset | Price Range |
|---|---:|
| **All Prices** | All listings |
| **Under $25** | Less than $25 |
| **$25–$50** | $25 to $50 |
| **$50–$100** | $50 to $100 |
| **$100–$200** | $100 to $200 |
| **$200+** | $200 and above |

### Additional Features

- 🏷️ Dynamic active filter badges
- ❌ One-click filter removal
- 🔄 **Reset All** functionality
- 📊 Multiple sorting options
- ⚡ Instant filtering

### Sorting Options

- **Most Popular**
- **Newest First**
- **Price: Low to High**
- **Price: High to Low**

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

The application provides a complete listing status lifecycle, allowing sellers to indicate when an item has been successfully sold.

### Mark as Sold

Sellers can mark an item as sold from:

- Listing detail view
- My Listings dashboard

When a listing is marked as sold:

- A prominent **SOLD OUT** overlay is displayed.
- The listing status is updated.
- Buyer inquiries are automatically disabled.
- The item is visually identified as unavailable.

### 📊 Seller Dashboard

The seller dashboard provides useful inventory information, including:

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

Students can save interesting listings and communicate directly with sellers through the application.

## ❤️ Saved Wishlist

Users can:

- Save listings with one tap.
- Remove saved listings.
- View saved items from the dedicated **Saved** tab.
- Keep saved items synchronized with their account.

## 💬 In-App Messaging

The application provides direct communication between buyers and sellers.

Features include:

- Buyer-seller conversation threads
- Direct messaging
- Listing context when starting a conversation
- Pre-filled item information
- Seller/buyer identification
- Prevention of sellers contacting themselves

## 🛡️ Campus Safety

Safety notices are included to encourage students to meet in appropriate public locations, such as:

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

# 🏗️ Application Architecture

Campus Marketplace follows a modern client-backend architecture using React Native/Expo on the frontend and Firebase as the backend platform.

```text
┌─────────────────────────────────────────┐
│           React Native + Expo           │
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │    Pages     │   │  Components   │  │
│  └──────┬───────┘   └───────┬───────┘  │
│         │                   │          │
│         └─────────┬─────────┘          │
│                   │                    │
│          Application State             │
│                   │                    │
└───────────────────┼────────────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │        Firebase        │
        │                        │
        │ ┌────────────────────┐ │
        │ │ Authentication     │ │
        │ └────────────────────┘ │
        │                        │
        │ ┌────────────────────┐ │
        │ │ Cloud Firestore    │ │
        │ └────────────────────┘ │
        └────────────────────────┘
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
| **Firebase Authentication** | Authentication |
| **React DOM** | `19.2.3` |
| **React Native Web** | `0.21.2` |
| **@expo/vector-icons** | Icons |
| **React Native StyleSheet** | Styling & design system |

### Design System

The application uses a unified React Native `StyleSheet` design system with centralized design tokens.

```text
src/theme.ts
```

This helps maintain consistent styling across the application.

---

# 💻 How to Run the Project Locally

## Prerequisites

Make sure the following are installed:

- **Node.js:** `v22.13.0` or newer
- **npm:** `v10.8.0` or newer

The project has been verified with:

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

Copy the sample environment file.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

> The application automatically supports an **offline demo mode** when custom Firebase credentials are not provided.

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

The application will be available at:

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
2. Connect your phone and development computer to the same network.
3. Scan the QR code displayed in the terminal.
4. Open the project using Expo Go.

---

## Option C — Type Checking & Configuration

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Verify Expo configuration:

```bash
npx expo config --type public
```

---

# 🔒 Security & Data Architecture

Security and controlled access are core parts of the Campus Marketplace architecture.

## 🌐 Unrestricted Browsing

Guest users can:

- Browse marketplace listings
- Search inventory
- Apply filters
- Explore campus inventory

## 🔐 Gated Interactions

Authenticated access is required for protected actions.

The application uses **Google OAuth authorization** and prompts unauthenticated users with a sign-in modal when they attempt to:

- Publish listings
- Contact sellers
- Access protected interactions

## 👤 Strict Data Isolation

Sellers can only modify or mark their own active listings as sold.

The application enforces ownership using:

```text
sellerId == auth.uid
```

## 🗄️ Firestore Security Rules

Database access is controlled using:

```text
firestore.rules
```

Rules enforce appropriate read/write permissions for:

```text
listings
users
users/{uid}/saved
conversations
```

## ⚡ Compound Indexing

Firestore indexes are defined in:

```text
firestore.indexes.json
```

The project includes compound indexing for:

```text
sellerId ASC
createdAt DESC
```

This supports efficient seller-specific listing queries combined with chronological sorting.

---

# 🌿 Git Collaboration & Branching Strategy

Our team followed a feature-branch workflow with peer-reviewed Pull Requests.

## Main Branch

```text
main
```

The `main` branch contains the stable version of the project.

## Feature Branches

### Enhanced Listing Search

```text
feature/enhanced-listing-search
```

Implemented:

- Enhanced search
- Categories
- Campus filtering

**Pull Request:** `#2`

---

### Sold-Out Feature

```text
sold-out-feature
```

Implemented:

- Listing status management
- Mark as Sold functionality
- Sold-out badges

**Pull Request:** `#4`

---

### Price Filter

```text
feature/price-filter
```

Implemented:

- Price ranges
- Price presets
- Active filter tags
- Filter reset functionality

**Pull Request:** `#5`

---

### UI Improvements

```text
feature/ui-improvements
```

Implemented:

- Unified themes
- Verified digital student ID card
- Empty states
- UI/UX improvements

---

# 📁 Project Structure

A simplified project structure is shown below:

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
- Simplify buying and selling within the campus community.
- Provide fast search and filtering.
- Enable direct buyer-seller communication.
- Allow users to save listings for later.
- Give sellers useful inventory statistics.
- Support safer in-person transactions.
- Demonstrate practical application of modern software development technologies.
- Demonstrate effective GitHub collaboration and feature-based development.

---

# 🧪 Testing & Verification

The following commands can be used to verify the project before submission:

### Install Dependencies

```bash
npm install
```

### TypeScript Validation

```bash
npx tsc --noEmit
```

### Expo Configuration

```bash
npx expo config --type public
```

### Start Web Application

```bash
npm run web
```

---

# 📸 Recommended Screenshots

For a stronger GitHub presentation, screenshots can be added to a `docs/screenshots` directory.

Recommended screenshots include:

| Screenshot | Description |
|---|---|
| 🏠 **Explore** | Main marketplace and listing feed |
| 🔎 **Search** | Keyword search functionality |
| 🎛️ **Filters** | Price, category, condition, and campus filters |
| 📄 **Listing Details** | Individual product information |
| ❤️ **Saved** | User's saved listings |
| 💬 **Messages** | Buyer-seller conversation |
| 📦 **My Listings** | Seller inventory dashboard |
| ✅ **Sold** | Sold-out listing state |
| 👤 **Profile** | User profile and digital student ID |

Suggested structure:

```text
docs/
└── screenshots/
    ├── home.png
    ├── search.png
    ├── filters.png
    ├── listing-details.png
    ├── saved.png
    ├── messages.png
    ├── my-listings.png
    └── profile.png
```

---



# 📚 Academic Context

Campus Marketplace was developed as part of a **Group Software Development Project**.

The project demonstrates practical experience in:

- React Native development
- Expo application development
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Firestore security rules
- Search and filtering
- State management
- UI/UX design
- Git and GitHub collaboration
- Feature branching
- Pull Requests
- Team-based software development

---

# 👨‍💻 Development Team

**Campus Marketplace Team**

> Built with ❤️ by university students, for university students.

---

## 📄 License

This project was developed for **academic and educational purposes** as part of a university Group Software Development Project.
