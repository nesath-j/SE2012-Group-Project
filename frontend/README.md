# VisionExpress Optical Store & Management Portal (Frontend)

A modern, responsive React web application built with **Vite** and **Vanilla CSS Design Tokens**, tailored precisely to integrate with the **Spring Boot REST APIs** located at `demo\src\main\java\com\VisionExpress\demo`.

---

## 🌟 Architecture & API Endpoints Integration

The frontend connects to the backend running on **`http://localhost:8081`** with built-in Vite dev proxy configured for seamless cross-origin requests.

| Domain | HTTP Method | Endpoint | Description | Frontend View / Component |
| :--- | :--- | :--- | :--- | :--- |
| **Products** | `GET` | `/api/products/search?keyword={kw}` | Search eyewear by name or retrieve all items | `ProductCatalog.jsx`, `InventoryAdmin.jsx` |
| **Products** | `POST` | `/api/products/add` | Add new eyewear/frame to catalog | `InventoryAdmin.jsx` (Add Product Modal) |
| **Products** | `PUT` | `/api/products/update/{id}` | Update product details | `InventoryAdmin.jsx` (Edit Product Modal) |
| **Products** | `DELETE` | `/api/products/delete/{id}` | Remove product from inventory | `InventoryAdmin.jsx` (Delete Confirmation) |
| **Products** | `PATCH` | `/api/products/{id}/stock?qty={qty}` | Update real-time inventory stock level | `InventoryAdmin.jsx` (Quick Adjuster & Modal) |
| **Orders** | `POST` | `/api/orders` | Create customer order with items & prescription | `CartDrawer.jsx` (Checkout flow) |
| **Orders** | `GET` | `/api/orders` | Retrieve list of all orders | `OrdersView.jsx` |
| **Orders** | `GET` | `/api/orders/{id}` | Retrieve single order with item line details | `OrdersView.jsx` (Order Details Modal) |
| **Orders** | `PATCH` | `/api/orders/{id}/status?status={s}` | Update order status | `OrdersView.jsx` (Inline Status Dropdown) |
| **Orders** | `PATCH` | `/api/orders/{id}/discount?discount={d}` | Apply loyalty tier discount to order | `OrdersView.jsx` (Apply Discount Modal) |
| **Deliveries**| `POST` | `/api/deliveries/dispatch?orderId=&courierId=` | Dispatch order to courier service | `DeliveryView.jsx` (Dispatch Station) |
| **Deliveries**| `GET` | `/api/deliveries/track/{orderId}` | Member tracks shipment status & ETA | `DeliveryView.jsx` (Live Stepper Console) |
| **Deliveries**| `PATCH` | `/api/deliveries/status?trackingNumber=&status=` | Courier updates transit status | `DeliveryView.jsx` (Milestone Updater) |

---

## 🚀 Key Features

1. **Optical Store Catalog (`ProductCatalog.jsx`)**
   - High-definition eyewear gallery (Ray-Ban, Gucci, Tom Ford, Oakley, contact lenses).
   - Real-time debounced query calling `/api/products/search?keyword=...`.
   - Filter by categories (*Sunglasses, Prescription Glasses, Designer Frames, Blue Light Blocking, Contact Lenses*).
   - Stock indicators (*In Stock, Low Stock, Out of Stock*).
   - Quick specs preview modal.

2. **Interactive Cart & Prescription Checkout (`CartDrawer.jsx`)**
   - Slide-in cart drawer with quantity adjustments and subtotal math.
   - **Attach Optical Prescription** toggle (`prescriptionAttached: boolean`).
   - Loyalty discount promo calculation (`VISION20`, `VISION10`, `FREESHIP`).
   - Direct order registration calling `POST /api/orders`.
   - Immediate order confirmation receipt with 1-click dispatch transition.

3. **Orders Dashboard (`OrdersView.jsx`)**
   - Complete orders registry fetched via `GET /api/orders`.
   - Status filtering & order search.
   - Inline status transitions via `PATCH /api/orders/{id}/status`.
   - Loyalty discount modal via `PATCH /api/orders/{id}/discount`.
   - Line items inspector modal via `GET /api/orders/{id}`.

4. **Courier Dispatch & Shipment Tracker (`DeliveryView.jsx`)**
   - **Live Stepper Tracker**: Visual progress pipeline for `DISPATCHED` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED`.
   - **Dispatch Station**: Assigns orders to courier partners (FedEx, DHL, Local Vision Courier) via `POST /api/deliveries/dispatch`.
   - **Courier Fleet Updater**: Milestone status update via `PATCH /api/deliveries/status`.

5. **Inventory Admin (`InventoryAdmin.jsx`)**
   - Product catalog management with SKU stats and stock monitors.
   - Full CRUD: Add (`POST`), Edit (`PUT`), Delete (`DELETE`), and Stock Update (`PATCH`).
   - Quick `+` and `-` quantity adjusters for immediate warehouse stock level updates.

6. **Automatic API Detection & Demo Mode**
   - The app dynamically detects if the Spring Boot server is running on `http://localhost:8081`.
   - When online, it communicates directly with the Spring Boot REST endpoints.
   - If the backend is temporarily offline, it gracefully falls back to responsive demo data in `localStorage`, allowing complete UI evaluation and testing without errors.
   - Users can toggle between **API Mode** and **Demo Mode** anytime via the status pill in the top navigation bar.

---

## 💻 How to Run

### 1. Run the Spring Boot Backend (Port 8081)
From the repository root:
```powershell
cd demo
.\mvnw.cmd spring-boot:run
```
*(Ensure MySQL `VisionExpress` database is running or schema is imported from `Database/Database.sql`)*

### 2. Run the React Frontend (Port 5173)
From the repository root:
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open your browser and visit: **`http://localhost:5173`**

### 3. Build for Production
```powershell
cd frontend
npm.cmd run build
```
Build output is generated cleanly in `frontend/dist/`.
