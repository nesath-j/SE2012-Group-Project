# VisionExpress Optical Practice Management - React Frontend

Modern, high-performance React web application built with **Vite**, **React 18**, and a custom **Glassmorphism Design System** for the VisionExpress optical clinic and practice management platform.

---

## 🚀 Running the Application

### 1. Prerequisites
- **Node.js**: v18+ (Node.js v24 LTS is installed)
- **Spring Boot Backend**: Port `8081` (`demo/src/main/resources/application.properties`)

### 2. Development Server
The application is pre-configured and currently running at:
```bash
http://localhost:5173
```

To run manually at any time:
```bash
cd frontend
npm run dev
```

### 3. Production Build
```bash
cd frontend
npm run build
```

---

## 📡 Spring Boot API Endpoints Mapped

All endpoints from `demo/src/main/java/com/VisionExpress/demo` are mapped and fully integrated:

### 1. Service Appointments (`/api/service-appointments`) - [ServiceAppointmentController.java](file:///c:/Users/nethu/Documents/Y2S1/Y2S1/OOAD_Project/SE2012-Group-Project/demo/src/main/java/com/VisionExpress/demo/controller/ServiceAppointmentController.java)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/service-appointments` | Book new optical service (`Frame Adjustment`, `Lens Fitting`, `Repair`) |
| `GET` | `/api/service-appointments` | List all service appointments |
| `GET` | `/api/service-appointments/{id}` | Get appointment details by ID |
| `GET` | `/api/service-appointments/member/{memberId}` | Filter appointments by member ID |
| `GET` | `/api/service-appointments/employee/{employeeId}` | Filter appointments by staff ID |
| `PATCH` | `/api/service-appointments/{id}/status?status={status}` | Update status (`Scheduled`, `In-Progress`, `Completed`, `Cancelled`) |
| `PUT` | `/api/service-appointments/{id}/cancel` | Cancel an appointment |

### 2. Courier Logistics (`/api/couriers`) - [CourierController.java](file:///c:/Users/nethu/Documents/Y2S1/Y2S1/OOAD_Project/SE2012-Group-Project/demo/src/main/java/com/VisionExpress/demo/controller/CourierController.java)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/couriers` | Register a new courier partner |
| `GET` | `/api/couriers` | List all courier partners |
| `GET` | `/api/couriers/{id}` | Retrieve courier details by ID |
| `GET` | `/api/couriers/service-type/{serviceType}` | Filter couriers by service type |
| `PUT` | `/api/couriers/{id}` | Update courier details |
| `DELETE` | `/api/couriers/{id}` | Remove courier partner |

### 3. Clinic Staff & Optometrists (`/api/employees`) - [EmployeeController.java](file:///c:/Users/nethu/Documents/Y2S1/Y2S1/OOAD_Project/SE2012-Group-Project/demo/src/main/java/com/VisionExpress/demo/controller/EmployeeController.java)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List all clinic staff and optometrists |
| `GET` | `/api/employees/{id}` | Retrieve staff member by ID |
| `GET` | `/api/employees/department/{department}` | Filter staff by assigned department |
| `POST` | `/api/employees` | Register new employee record |
| `PUT` | `/api/employees/{id}` | Update staff role and department |
| `DELETE` | `/api/employees/{id}` | Delete employee record |

### 4. Eyewear & Optical Products (`/api/products`) - [ProductController.java](file:///c:/Users/nethu/Documents/Y2S1/Y2S1/OOAD_Project/SE2012-Group-Project/demo/src/main/java/com/VisionExpress/demo/controller/ProductController.java)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products/add` | Add new eyewear, contact lenses, or accessories to inventory |

---

## ✨ Features & Architecture

1. **Executive Dashboard**:
   - Practice KPI metrics (Service Appointments, Courier Partners, Staff Optometrists, Eyewear Catalog).
   - Real-time status breakdown (Scheduled, In-Progress, Completed, Cancelled).
   - Quick navigation and action buttons.

2. **Full CRUD Management Views**:
   - **Appointments**: Modal booking with validation, status transitions, member/employee filters, cancel action.
   - **Couriers**: Add, edit, delete, and filter by service type.
   - **Employees**: Add, edit, delete, and department filtering.
   - **Products**: Designer frame & lens catalog, category filters, and modal adding via `/api/products/add`.

3. **REST API Explorer**:
   - Built-in Swagger-like interactive API console allowing live requests and JSON inspection for all 13 backend endpoints.

4. **Resilient Offline/Demo Support**:
   - Detects backend connectivity at `http://localhost:8081` in real-time.
   - When the backend is offline, activates local persistent mock storage so all UI flows remain completely testable.

5. **Aesthetics & Theme**:
   - Modern Google Fonts (`Plus Jakarta Sans` & `Outfit`).
   - Frosted glass cards, responsive layouts, subtle gradients, and dark/light mode toggle.
