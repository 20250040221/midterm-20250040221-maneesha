# Private Hospital & Channeling Center REST API

**Midterm Examination Project**  
- **Student Name:** Rathnayaka Mudiyanselage Maneesha Kalpani  
- **NIM:** 20250040221  
- **Theme:** Private Hospital & Channeling Center  
- **Technology Stack:** Node.js, Express 5 (`express@5.3.0`), Nodemon  

---

##  Project Overview

This project is a complete RESTful API built for a **Private Hospital & Channeling Center** using **Node.js** and **Express 5**. The API manages doctor channeling, patient appointments, and hospital document paths without an external database, utilizing clean in-memory JavaScript data structures.

### Key Express 5 Highlights & Architectural Features
1. **Express 5 Optional Route Parameters (`{ }`):**
   - Implemented at `GET /appointments/specialty{/:name}` to support both filtered searches (e.g. `/appointments/specialty/Cardiology`) and unparameterized all-items listing (e.g. `/appointments/specialty`) within a single route handler.
2. **Express 5 Named Wildcards (`*path`):**
   - Implemented at `GET /files/*path` using the new Express 5 syntax where matched wildcards are parsed directly into an array of path segments.
3. **Native Async Error Propagation:**
   - Asynchronous route handlers (`GET`, `PUT`, and `DELETE`) throw custom errors with specific HTTP status codes (e.g., 404). In Express 5, rejected promises and thrown errors inside async handlers are automatically routed to the global error middleware without requiring boilerplate `try/catch` or wrapper libraries.
4. **Grouped Route Handlers (`router.route()`):**
   - Utilizes `router.route()` on paths like `/` and `/:id` in both `appointments.js` and `doctors.js` to cleanly bind multiple HTTP methods to common URI endpoints.
5. **Strict Middleware Ordering:**
   - `express.json()` and `logger` &rarr; Route Handlers &rarr; `notFound` (404 catch-all) &rarr; `errorHandler` (4-parameter global handler).
6. **Consistent JSON Error Format:**
   - Every error response across all endpoints (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) follows a standardized contract:
     ```json
     {
       "success": false,
       "status": 404,
       "message": "Appointment with ID 99 was not found."
     }
     ```

---

##  Exact Directory Structure

```text
midterm-20250040221-maneesha/
├── index.js                  # Express 5 server configuration & route mounting
├── middleware.js             # Logger, RequireAuth, 404 NotFound, and ErrorHandler
├── routes/
│   ├── appointments.js       # Main resource (Appointments CRUD, query search, optional param)
│   └── doctors.js            # Bonus resource (Doctors CRUD)
├── screenshots/              # Folder for test and API execution screenshots
├── .gitignore                # Node modules and temp files exclusion
├── package.json              # Express 5 dependency, nodemon devDependency, scripts
└── README.md                 # Complete documentation and API route guide
```

---

##  Installation & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18, 20, 22, or 24 recommended)
- `npm` (Node Package Manager)

### 1. Install Dependencies
Navigate into the project directory and install all required packages:
```bash
cd midterm-20250040221-maneesha
npm install
```

### 2. Run the Development Server (with Nodemon)
```bash
npm run dev
```

### 3. Run in Standard Mode
```bash
npm start
```

The server will initialize on port `3000`:
```text
================================================================
 Hospital & Channeling Center API is running!
 Student: Rathnayaka Mudiyanselage Maneesha Kalpani (NIM: 20250040221)
 Environment: Express 5
 URL: http://localhost:3000
================================================================
```

---

## Authentication for Protected Routes

Certain sensitive operations, such as **deleting an appointment**, are protected by custom authorization middleware (`requireAuth`).

- **Header Name:** `x-auth-token`
- **Secret Token:** `hospital-secret-123`

### Example Request with Token:
```http
DELETE /appointments/1 HTTP/1.1
Host: localhost:3000
x-auth-token: hospital-secret-123
```

If the header is missing or contains an invalid value, the API returns HTTP 401:
```json
{
  "success": false,
  "status": 401,
  "message": "Unauthorized: Missing or invalid 'x-auth-token' header. Valid token is required for this operation."
}
```

---

##  Comprehensive API Route Reference

### 1. Root & System Routes

| Method | Endpoint | Description | Auth Required? | Expected Status |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/` | Returns welcome message, student information (Name & NIM), and theme details | No | `200 OK` |
| `GET` | `/files/*path` | **Express 5 Named Wildcard**: Returns matched path segments as an array | No | `200 OK` |

#### Example: Express 5 Wildcard
- **Request:** `GET http://localhost:3000/files/documents/prescriptions/2026/report.pdf`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Express 5 wildcard path extracted successfully.",
    "path": [
      "documents",
      "prescriptions",
      "2026",
      "report.pdf"
    ]
  }
  ```

---

### 2. Appointments Resource (`/appointments`) - Main Resource

Data Schema:
- `id` (Number, auto-incremented)
- `patientName` (String)
- `doctorName` (String)
- `specialty` (String)
- `fee` (Number)
- `status` (String: `"Confirmed"`, `"Scheduled"`, `"Completed"`, `"Pending"`)

| Method | Endpoint | Description | Auth Required? | Status |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/appointments` | List all hospital channeling appointments | No | `200 OK` |
| `GET` | `/appointments/search?patient=...` | **Bonus**: Search appointments by patient name via query parameter | No | `200 OK` |
| `GET` | `/appointments/specialty{/:name}` | **Express 5 Optional Parameter**: Filter by medical specialty (e.g. `Cardiology`). If omitted, returns all. | No | `200 OK` |
| `GET` | `/appointments/:id` | **Async Route**: Fetch single appointment by ID. Throws 404 if not found. | No | `200 OK` / `404 Not Found` |
| `POST` | `/appointments` | Create appointment. Validates required fields with `if/else`. Returns 400 if invalid. | No | `201 Created` / `400 Bad Request` |
| `PUT` | `/appointments/:id` | **Async Route**: Update an appointment by ID. Throws 404 if not found. | No | `200 OK` / `400 / 404` |
| `DELETE` | `/appointments/:id` | Protected deletion. Requires `x-auth-token: hospital-secret-123`. | **Yes (`401`)** | `200 OK` / `401 / 404` |

#### Example: POST `/appointments` Body
```json
{
  "patientName": "Sunil Shantha",
  "doctorName": "Dr. Malini Wickramasinghe",
  "specialty": "Neurology",
  "fee": 5500,
  "status": "Confirmed"
}
```

---

### 3. Doctors Resource (`/doctors`) - Bonus Second Resource

Data Schema:
- `id` (Number, auto-incremented)
- `name` (String)
- `specialty` (String)
- `consultationFee` (Number)
- `available` (Boolean)

| Method | Endpoint | Description | Auth Required? | Status |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/doctors` | List all doctors | No | `200 OK` |
| `GET` | `/doctors/:id` | Get details of a single doctor by ID | No | `200 OK` / `404 Not Found` |
| `POST` | `/doctors` | Add a new doctor with field validation | No | `201 Created` / `400 Bad Request` |
| `PUT` | `/doctors/:id` | Update doctor information | No | `200 OK` / `400 / 404` |
| `DELETE` | `/doctors/:id` | Remove a doctor by ID | No | `200 OK` / `404 Not Found` |

#### Example: POST `/doctors` Body
```json
{
  "name": "Dr. Nuwan Kulasekara",
  "specialty": "Ophthalmology",
  "consultationFee": 4200,
  "available": true
}
```

---

## 🧪 Testing with cURL

### 1. Root Welcome Route
```bash
curl -X GET http://localhost:3000/
```

### 2. Search Appointments by Patient Name (Query String)
```bash
curl -X GET "http://localhost:3000/appointments/search?patient=kamal"
```

### 3. Optional Parameter Specialty Filter (Express 5)
```bash
# Filter by specialty:
curl -X GET http://localhost:3000/appointments/specialty/Cardiology

# Without specialty (returns all appointments):
curl -X GET http://localhost:3000/appointments/specialty
```

### 4. Create an Appointment (Validation Test)
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName":"Anoma Perera","doctorName":"Dr. Anura Bandara","specialty":"Cardiology","fee":4500,"status":"Scheduled"}'
```

### 5. Protected Appointment Deletion
```bash
# Attempt without token -> 401 Unauthorized
curl -X DELETE http://localhost:3000/appointments/1

# Successful deletion with secret header -> 200 OK
curl -X DELETE http://localhost:3000/appointments/1 \
  -H "x-auth-token: hospital-secret-123"
```

### 6. Express 5 Named Wildcard
```bash
curl -X GET http://localhost:3000/files/patients/scans/2026/mri-scan.dcm
```

---

##  Error Handling Contract

All error responses strictly adhere to the following unified JSON structure:

```json
{
  "success": false,
  "status": 404,
  "message": "Resource not found: GET /invalid-endpoint"
}
```
