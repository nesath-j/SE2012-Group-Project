# Vision Express — Optical Clinic & Eyewear React Frontend

Modern, high-performance React web application for **Vision Express**, integrated with the Spring Boot backend (`com.VisionExpress.demo`).

---

## 🌟 Architecture & Features

### 1. Spring Boot API Integration
- **Doctor Appointments (`/api/doctor-appointments`)**:
  - `POST /api/doctor-appointments` — Books appointment slot (dynamically marks schedule slot as `booked = true`).
  - `GET /api/doctor-appointments/doctor/{doctorId}` — Filter appointments by specialist doctor.
  - `GET /api/doctor-appointments/member/{memberId}` — Filter appointments by patient/member.
  - `PUT /api/doctor-appointments/{id}/notes` — Update clinical examination & prescription notes.
  - `PUT /api/doctor-appointments/{id}/status` — Transition appointment lifecycle (`SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
- **Doctor Directory (`/api/doctors`)**:
  - `GET /api/doctors` & `GET /api/doctors/{id}` — Practitioner directory.
  - `POST /api/doctors` — Register eye specialists.
  - `PUT /api/doctors/{id}` — Edit credentials and license.
  - `DELETE /api/doctors/{id}` — Deregister doctors.
- **Doctor Schedules (`/api/doctor-schedules`)**:
  - `GET /api/doctor-schedules` & `GET /api/doctor-schedules/{id}` — Time slot catalog.
  - `GET /api/doctor-schedules/doctor/{doctorId}/available` — Query open, unbooked slots.
  - `POST /api/doctor-schedules` — Define new consultation shifts.
  - `PUT /api/doctor-schedules/{id}` & `DELETE /api/doctor-schedules/{id}` — Shift adjustments.
- **Eyewear & Product Catalog (`/add`)**:
  - `POST /add` — Save optical frames, prescription lenses, and sunglasses.

### 2. Design & Aesthetics
- **Dark Luxury Glassmorphism**: Tailored palette (`#0a0f1d`, `#0f172a`, glowing cyan `#06b6d4`, emerald `#10b981`).
- **Modern Typography**: Google Fonts **Outfit** (headings) & **Inter** (clinical data tables).
- **Backend Status Monitor**: Auto-pings Spring Boot on port 8081 with zero-setup demo mode fallback.
- **Interactive Swagger-like API Inspector**: Test all Spring Boot endpoints directly inside the web interface.

---

## 🚀 Running the Frontend

### Prerequisites
Node.js & npm (installed at `C:\Users\manud\nodejs`).

### Start Vite Dev Server:
```bash
cd frontend
npm run dev
```
The application will be live at:
**[http://localhost:3000](http://localhost:3000)**

### Production Build:
```bash
cd frontend
npm run build
```
Build output is generated inside `frontend/dist/`.
