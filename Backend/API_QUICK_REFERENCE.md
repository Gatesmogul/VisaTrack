# VisaTrack API Quick Reference

> Quick reference for all API endpoints. For detailed examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Include in all requests (except login):
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Endpoints Summary

### Flow 1: Visa Lookup

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/visa/lookup` | Look up visa requirements |
| `GET` | `/visa/details/:ruleId` | Get detailed visa info |
| `GET` | `/visa/recent` | Get recent lookups |
| `POST` | `/visa/save` | Save a requirement |
| `GET` | `/visa/saved` | Get saved requirements |
| `DELETE` | `/saved/:id` | Remove saved requirement |

### Flow 2: Application Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/applications` | Create new application |
| `GET` | `/applications/dashboard` | Get all applications + deadlines |
| `PATCH` | `/applications/:id/status` | Update application status |

### Flow 3: Document Checklist

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/applications/:id/checklist` | Get document checklist |

### Flow 4: Timeline Calculator

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/timeline/calculate` | Calculate visa timeline |

### Flow 5: Multi-Country Planner

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/trips/plan` | Analyze multi-country trip |
| `GET` | `/trips/:id/feasibility` | Get trip feasibility |

### Additional Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/embassies` | List all embassies |
| `GET` | `/embassies/:id` | Get embassy details |
| `GET` | `/notifications` | Get my notifications |
| `PATCH` | `/notifications/:id/read` | Mark as read |
| `GET` | `/visa-rules/check` | Check visa (Admin/Logic) |
| `GET` | `/visa-rules/:id/documents` | Get rule documents |

---


## Request/Response Quick Reference

### POST /visa/lookup

**Request:**
```json
{
  "passportCountry": "NG",
  "destinationCountry": "TH",
  "purpose": "TOURISM",
  "arrivalDate": "2026-03-15",
  "departureDate": "2026-03-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "visaType": "VISA_ON_ARRIVAL",
    "visaTypeFriendly": "Visa on Arrival",
    "allowedStayDays": 15,
    "processingTime": { "min": 0, "max": 1 },
    "fees": { "visaCost": 35, "currency": "USD" },
    "preArrivalRequirements": [...],
    "warnings": [...]
  }
}
```

---

### POST /applications

**Request:**
```json
{
  "tripDestinationId": "507f1f77bcf86cd799439011",
  "destinationCountry": "AU",
  "visaType": "ETA",
  "applicationChannel": "MOBILE_APP",
  "tripDate": "2026-06-01"
}
```

---

### PATCH /applications/:id/status

**Request:**
```json
{
  "status": "SUBMITTED",
  "referenceNumber": "VFS-2026-123456",
  "submissionDate": "2026-04-01"
}
```

**Status Options:**
- `NOT_STARTED`
- `DOCUMENTS_IN_PROGRESS`
- `APPOINTMENT_BOOKED`
- `SUBMITTED`
- `UNDER_REVIEW`
- `ADDITIONAL_DOCS_REQUESTED`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

---

### POST /timeline/calculate

**Request:**
```json
{
  "tripDate": "2026-06-15",
  "destinationCountry": "AU",
  "visaType": "E_VISA"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": { "daysUntilTrip": 45, "visaType": "E_VISA" },
    "keyDates": {
      "recommendedStartDate": "2026-05-11",
      "latestSubmissionDate": "2026-05-25",
      "expectedDecisionDate": "2026-05-28",
      "travelDate": "2026-06-15"
    },
    "riskAssessment": { "level": "LOW", "color": "green" },
    "milestones": [...]
  }
}
```

---

### POST /trips/plan

**Request:**
```json
{
  "passportCountry": "NG",
  "purpose": "TOURISM",
  "destinations": [
    { "countryCode": "TH", "arrivalDate": "2026-03-15", "departureDate": "2026-03-22" },
    { "countryCode": "VN", "arrivalDate": "2026-03-22", "departureDate": "2026-03-28" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "feasibilityStatus": "FEASIBLE",
    "feasibilityScore": 85,
    "summary": {
      "totalDestinations": 2,
      "visaFreeDestinations": 0,
      "visasRequired": 2,
      "issueCount": 0
    },
    "optimalApplicationOrder": [...],
    "recommendations": [...]
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request (check your data) |
| `401` | Unauthorized (check token) |
| `404` | Not found |
| `500` | Server error (try again) |

---

## Country Codes

| Country | Code |
|---------|------|
| South Africa | ZA |
| Ghana | GH |
| Tanzania | TZ |
| Rwanda | RW |
| Kenya | KE |
| Uganda | UG |
| Nigeria | NG |
| Egypt | EG |
| Madagascar | MG |
| Seychelles | SC |
| UAE | AE |
| Thailand | TH |
| India | IN |
| Australia | AU |
| Dominican Republic | DO |

---

## Visa Types

| Type | Description |
|------|-------------|
| `VISA_FREE` | No visa needed |
| `E_VISA` | Apply online |
| `VISA_ON_ARRIVAL` | Get at airport |
| `EMBASSY_VISA` | Apply at embassy |
| `ETA` | Electronic Travel Authorization |
| `TRAVEL_AUTH` | Travel Authorization |
| `TRANSIT_VISA` | For transit only |

---

## Application Channels

| Channel | Description |
|---------|-------------|
| `EMBASSY` | Embassy/Consulate |
| `VFS_GLOBAL` | VFS Global center |
| `TLS_CONTACT` | TLS Contact center |
| `EVISA_PORTAL` | Online portal |
| `ETA_PORTAL` | ETA system |
| `MOBILE_APP` | Mobile app |
| `ON_ARRIVAL` | At airport |
