# VisaTrack API Documentation

> **For Beginners**: This guide is written for developers who only know HTML, CSS, and basic JavaScript. No backend experience required!

## Table of Contents

1. [What is an API?](#what-is-an-api)
2. [Getting Started](#getting-started)
3. [How to Make API Requests](#how-to-make-api-requests)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
   - [Visa Lookup (Flow 1)](#1-visa-requirement-lookup)
   - [Application Tracking (Flow 2)](#2-application-tracking)
   - [Document Checklist (Flow 3)](#3-document-checklist)
   - [Timeline Calculator (Flow 4)](#4-timeline-calculator)
   - [Multi-Country Planner (Flow 5)](#5-multi-country-trip-planner)
6. [Error Handling](#error-handling)
7. [Troubleshooting](#troubleshooting)
8. [Complete Examples](#complete-examples)

---

## What is an API?

**API** stands for "Application Programming Interface". Think of it as a **waiter in a restaurant**:

- You (the customer) don't go into the kitchen
- Instead, you tell the waiter what you want
- The waiter goes to the kitchen, gets your food, and brings it back

Similarly:
- Your website (the customer) doesn't access the database directly
- It sends a request to the API (the waiter)
- The API gets the data and sends it back to your website

### Key Terms You'll See

| Term | What It Means | Example |
|------|---------------|---------|
| **Endpoint** | A URL where you send requests | `https://api.visatrack.com/visa/lookup` |
| **Request** | What you send TO the API | "Get visa requirements for US to Thailand" |
| **Response** | What the API sends BACK to you | `{ "visaType": "VISA_FREE", "days": 60 }` |
| **HTTP Method** | The type of action you want | GET (read), POST (create), PATCH (update) |
| **Headers** | Extra information sent with your request | Your login token, content type |
| **Body** | The main data you're sending | The form data from your user |

---

## Getting Started

### Step 1: Understand the Base URL

All API requests go to:

```
https://your-server.com/api/v1
```

Replace `your-server.com` with your actual server address. During development, this is often:

```
http://localhost:3000/api/v1
```

### Step 2: Get Your Authentication Token

Before making most requests, you need to be logged in. When a user logs in, they receive a **token** - a long string that proves who they are.

```javascript
// After login, you'll receive something like:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI..."
}
```

**Save this token!** You'll need it for every request.

### Step 3: Test Your Setup

Open your browser's **Developer Tools**:

1. **Windows/Linux**: Press `F12` or `Ctrl + Shift + I`
2. **Mac**: Press `Cmd + Option + I`
3. Click the **Console** tab

Copy and paste this code to test if the API is reachable:

```javascript
fetch('http://localhost:3000/api/v1/health')
  .then(response => response.json())
  .then(data => console.log('API is working!', data))
  .catch(error => console.log('API error:', error));
```

If you see "API is working!", you're ready to go!

---

## How to Make API Requests

### The Basic Pattern

Every API request follows this pattern:

```javascript
fetch(URL, {
  method: 'POST',           // The HTTP method
  headers: {
    'Content-Type': 'application/json',     // Tell API you're sending JSON
    'Authorization': 'Bearer YOUR_TOKEN'    // Your login token
  },
  body: JSON.stringify({    // The data you're sending
    key: 'value'
  })
})
.then(response => response.json())    // Convert response to JavaScript
.then(data => {
  console.log(data);        // Use the data
})
.catch(error => {
  console.error('Error:', error);     // Handle errors
});
```

### Breaking It Down

#### 1. The URL
```javascript
'http://localhost:3000/api/v1/visa/lookup'
```
This is WHERE you're sending the request.

#### 2. The Method
```javascript
method: 'POST'
```
- `GET` = Read/retrieve data
- `POST` = Create new data
- `PATCH` = Update existing data
- `DELETE` = Remove data

#### 3. The Headers
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGci...'
}
```
- `Content-Type`: Tells the API the format of your data
- `Authorization`: Your login token (get this after login)

#### 4. The Body
```javascript
body: JSON.stringify({
  passportCountry: 'US',
  destinationCountry: 'TH'
})
```
The actual data you're sending. **Must be converted to JSON** using `JSON.stringify()`.

---

## Authentication

### How Login Works

1. User enters email and password
2. Your app sends these to the login endpoint
3. API verifies credentials and returns a **token**
4. You save this token and send it with every future request

### Login Example

```javascript
// Step 1: Create the login function
async function loginUser(email, password) {
  
  // Step 2: Send the request
  const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // No Authorization needed for login
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  // Step 3: Get the response
  const data = await response.json();

  // Step 4: Check if login was successful
  if (data.success) {
    // Step 5: Save the token for later use
    localStorage.setItem('authToken', data.token);
    console.log('Login successful!');
    return data;
  } else {
    console.log('Login failed:', data.message);
    return null;
  }
}

// Step 6: Use the function
loginUser('user@example.com', 'password123');
```

### Using the Token in Future Requests

```javascript
// Get the saved token
const token = localStorage.getItem('authToken');

// Use it in your request
fetch('http://localhost:3000/api/v1/visa/lookup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token    // Add token here
  },
  body: JSON.stringify({
    // your data
  })
});
```

---

## API Endpoints

## 1. Visa Requirement Lookup

> **What it does**: Tells you what visa a person needs to travel from one country to another.

### Endpoint Details

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/visa/lookup` |
| **Method** | `POST` |
| **Authentication** | Required (token) |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `passportCountry` | String | ✅ Yes | The country code of the traveler's passport (e.g., "US", "NG", "IN") |
| `destinationCountry` | String | ✅ Yes | The country code they want to visit (e.g., "TH", "AE", "KE") |
| `purpose` | String | No | Why they're traveling. Default: "TOURISM". Options: "TOURISM", "BUSINESS", "TRANSIT", "STUDY", "WORK" |
| `arrivalDate` | String | No | When they plan to arrive (format: "2026-03-15") |
| `departureDate` | String | No | When they plan to leave |
| `hasValidVisaFrom` | Array | No | Other countries they have valid visas from (e.g., ["US", "GB"]) |

### Complete Example

```javascript
/**
 * Look up visa requirements for a trip
 * 
 * This function checks what visa (if any) is needed
 * for someone to travel between two countries
 */
async function lookupVisaRequirements() {
  
  // Step 1: Get your authentication token
  const token = localStorage.getItem('authToken');
  
  // Step 2: Prepare the data you want to send
  const requestData = {
    passportCountry: 'NG',           // Nigerian passport
    destinationCountry: 'TH',        // Going to Thailand
    purpose: 'TOURISM',              // For vacation
    arrivalDate: '2026-03-15',       // Arriving March 15
    departureDate: '2026-03-30'      // Leaving March 30
  };
  
  // Step 3: Send the request
  try {
    const response = await fetch('http://localhost:3000/api/v1/visa/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(requestData)
    });
    
    // Step 4: Convert response to JavaScript object
    const result = await response.json();
    
    // Step 5: Check if successful
    if (result.success) {
      console.log('Visa Type:', result.data.visaType);
      console.log('Stay Allowed:', result.data.allowedStayDays, 'days');
      console.log('Processing Time:', result.data.processingTime.max, 'days');
      
      // Step 6: Show any warnings to the user
      if (result.data.warnings && result.data.warnings.length > 0) {
        result.data.warnings.forEach(warning => {
          console.log('⚠️ Warning:', warning.message);
        });
      }
      
      return result.data;
    } else {
      console.error('Lookup failed:', result.error);
      return null;
    }
    
  } catch (error) {
    // Step 7: Handle network errors
    console.error('Network error:', error.message);
    return null;
  }
}

// Call the function
lookupVisaRequirements();
```

### What You'll Receive (Success Response)

```json
{
  "success": true,
  "data": {
    "visaType": "VISA_ON_ARRIVAL",
    "visaTypeFriendly": "Visa on Arrival",
    
    "destination": {
      "name": "Thailand",
      "isoCode": "TH"
    },
    "passport": {
      "name": "Nigeria",
      "isoCode": "NG"
    },
    "purpose": "TOURISM",
    
    "allowedStayDays": 15,
    
    "processingTime": {
      "min": 0,
      "max": 1,
      "unit": "business days"
    },
    
    "fees": {
      "visaCost": 35,
      "currency": "USD"
    },
    
    "passportValidityDays": 180,
    "blankPagesRequired": 2,
    
    "preArrivalRequirements": [
      {
        "type": "TDAC",
        "name": "Thailand Digital Arrival Card",
        "portalUrl": "https://tdac.immigration.go.th",
        "advanceHours": 72,
        "mandatory": true,
        "notes": "TDAC mandatory 72 hours before arrival"
      }
    ],
    
    "warnings": [
      {
        "type": "PRE_ARRIVAL_FORM",
        "severity": "WARNING",
        "message": "Thailand Digital Arrival Card must be completed 72 hours before arrival",
        "action": "Complete at: https://tdac.immigration.go.th"
      }
    ],
    
    "lastUpdated": "2026-01-15T12:00:00.000Z"
  }
}
```

### Understanding the Response

| Field | What It Means | What to Do With It |
|-------|---------------|-------------------|
| `visaType` | The type of visa needed | Show to user: "You need a Visa on Arrival" |
| `visaTypeFriendly` | Human-readable visa type | Display this directly to users |
| `allowedStayDays` | How many days they can stay | Show: "You can stay up to 15 days" |
| `processingTime` | How long to get the visa | Show: "Processing takes 0-1 days" |
| `fees.visaCost` | Cost of the visa | Show: "Visa costs $35 USD" |
| `passportValidityDays` | Passport must be valid for this many days | Warn if passport expires too soon |
| `preArrivalRequirements` | Forms to complete before travel | List these with links |
| `warnings` | Important alerts | Display prominently to user |

---

## 2. Application Tracking

> **What it does**: Tracks visa applications from start to approval/rejection.

### 2.1 Create New Application

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/applications` |
| **Method** | `POST` |
| **Authentication** | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tripId` | String | No | ID of the trip this visa is for |
| `tripDestinationId` | String | ✅ Yes | ID of the specific destination |
| `destinationCountry` | String | ✅ Yes | Country code (e.g., "AU") |
| `visaType` | String | No | Type of visa (e.g., "E_VISA") |
| `applicationChannel` | String | No | Where you're applying (e.g., "VFS_GLOBAL") |
| `tripDate` | String | No | Travel date (for timeline calculation) |

#### Complete Example

```javascript
async function createVisaApplication() {
  const token = localStorage.getItem('authToken');
  
  const applicationData = {
    tripDestinationId: '507f1f77bcf86cd799439011',  // From your trip data
    destinationCountry: 'AU',                        // Australia
    visaType: 'ETA',                                 // Electronic Travel Authorization
    applicationChannel: 'MOBILE_APP',                // Applying via the ETA app
    tripDate: '2026-06-01'                           // Travel date
  };
  
  const response = await fetch('http://localhost:3000/api/v1/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(applicationData)
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Application created!');
    console.log('Application ID:', result.data._id);
    console.log('Status:', result.data.status);
    console.log('Submit by:', result.data.latestSubmissionDate);
    return result.data;
  }
}
```

### 2.2 Get Application Dashboard

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/applications/dashboard` |
| **Method** | `GET` |
| **Authentication** | Required |

#### Complete Example

```javascript
async function getMyApplications() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/api/v1/applications/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Show application summary
    console.log('Total Applications:', result.data.totalApplications);
    console.log('Not Started:', result.data.statusSummary.notStarted);
    console.log('In Progress:', result.data.statusSummary.inProgress);
    console.log('Approved:', result.data.statusSummary.approved);
    console.log('Needs Attention:', result.data.statusSummary.needsAttention);
    
    // Show upcoming deadlines
    console.log('\nUpcoming Deadlines:');
    result.data.upcomingDeadlines.forEach(deadline => {
      console.log(`- ${deadline.name}: Due ${deadline.dueDate}`);
    });
    
    // List all applications
    result.data.applications.forEach(app => {
      console.log(`\n${app.destinationIsoCode}: ${app.status}`);
    });
  }
}
```

### 2.3 Update Application Status

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/applications/:applicationId/status` |
| **Method** | `PATCH` |
| **Authentication** | Required |

**Note**: Replace `:applicationId` with the actual ID.

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | New status. Options: "NOT_STARTED", "DOCUMENTS_IN_PROGRESS", "APPOINTMENT_BOOKED", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED" |
| `notes` | String | Optional notes |
| `referenceNumber` | String | Application reference from embassy |
| `appointmentDate` | String | Date of appointment |
| `submissionDate` | String | When you submitted |

#### Complete Example

```javascript
async function updateApplicationStatus(applicationId, newStatus) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `http://localhost:3000/api/v1/applications/${applicationId}/status`, 
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        status: newStatus,
        notes: 'Updated from the app',
        referenceNumber: 'VFS-2026-123456'
      })
    }
  );
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Status updated to:', result.data.status);
  }
}

// Example: Mark application as submitted
updateApplicationStatus('507f1f77bcf86cd799439011', 'SUBMITTED');
```

---

## 3. Document Checklist

> **What it does**: Gets the list of documents needed for a visa application.

### Get Document Checklist

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/applications/:applicationId/checklist` |
| **Method** | `GET` |
| **Authentication** | Required |

#### Complete Example

```javascript
async function getDocumentChecklist(applicationId) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(
    `http://localhost:3000/api/v1/applications/${applicationId}/checklist`,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  );
  
  const result = await response.json();
  
  if (result.success) {
    // Show progress
    console.log(`Progress: ${result.data.progress.percentage}%`);
    console.log(`Completed: ${result.data.progress.completed} of ${result.data.progress.totalRequired}`);
    
    // List each document
    console.log('\nDocuments Required:');
    result.data.checklist.forEach(doc => {
      const statusEmoji = doc.status === 'VALID' ? '✅' : 
                          doc.status === 'UPLOADED' ? '📤' : '⬜';
      
      console.log(`${statusEmoji} ${doc.name} ${doc.mandatory ? '(Required)' : '(Optional)'}`);
      
      if (doc.tips && doc.tips.length > 0) {
        doc.tips.forEach(tip => console.log(`   💡 ${tip}`));
      }
    });
    
    // Show validation errors
    if (result.data.validationErrors.length > 0) {
      console.log('\n⚠️ Issues Found:');
      result.data.validationErrors.forEach(err => console.log(`- ${err}`));
    }
  }
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "checklist": [
      {
        "id": "507f191e810c19729de860ea",
        "documentType": "PASSPORT",
        "name": "Valid Passport",
        "description": "Bio-data page scan",
        "mandatory": true,
        "specifications": {
          "document": {
            "maxFileSizeMB": 10,
            "allowedFormats": ["PDF", "JPEG", "PNG"]
          },
          "validity": {
            "mustBeValidForDays": 180
          }
        },
        "tips": [
          "Scan must be clear and all text readable",
          "Include both the photo page and signature page"
        ],
        "status": "PENDING"
      },
      {
        "id": "507f191e810c19729de860eb",
        "documentType": "PASSPORT_PHOTO",
        "name": "Passport Photo",
        "description": "Recent photograph",
        "mandatory": true,
        "specifications": {
          "photo": {
            "widthMM": 35,
            "heightMM": 45,
            "backgroundColors": ["white"],
            "requirements": ["No glasses", "Neutral expression", "Face centered"]
          }
        },
        "status": "UPLOADED"
      }
    ],
    "progress": {
      "totalRequired": 5,
      "completed": 2,
      "percentage": 40
    },
    "validationErrors": []
  }
}
```

---

## 4. Timeline Calculator

> **What it does**: Calculates when to start your visa application and important deadlines.

### Calculate Timeline

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/timeline/calculate` |
| **Method** | `POST` |
| **Authentication** | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tripDate` | String | ✅ Yes | When you want to travel (e.g., "2026-06-15") |
| `destinationCountry` | String | ✅ Yes | Country code (e.g., "AU") |
| `visaType` | String | No | Type of visa |
| `processingTimeMin` | Number | No | Minimum processing days |
| `processingTimeMax` | Number | No | Maximum processing days |

#### Complete Example

```javascript
async function calculateVisaTimeline(tripDate, destination) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/api/v1/timeline/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      tripDate: tripDate,
      destinationCountry: destination,
      visaType: 'E_VISA'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    const data = result.data;
    
    // Show summary
    console.log('=== Timeline Summary ===');
    console.log(`Days until trip: ${data.summary.daysUntilTrip}`);
    console.log(`Visa type: ${data.summary.visaType}`);
    
    // Show key dates
    console.log('\n=== Key Dates ===');
    console.log(`Start preparing: ${data.keyDates.recommendedStartDate}`);
    console.log(`Submit by: ${data.keyDates.latestSubmissionDate}`);
    console.log(`Expect decision: ${data.keyDates.expectedDecisionDate}`);
    console.log(`Travel date: ${data.keyDates.travelDate}`);
    
    // Show risk level
    console.log('\n=== Risk Assessment ===');
    console.log(`Risk Level: ${data.riskAssessment.level}`);
    console.log(`Message: ${data.riskAssessment.message}`);
    
    // Color coding for UI
    // data.riskAssessment.color can be: 'green', 'yellow', 'orange', 'red'
    
    // Show milestones
    console.log('\n=== Milestones ===');
    data.milestones.forEach(m => {
      console.log(`${m.order}. ${m.name} - Due: ${m.dueDate}`);
    });
    
    // Show recommendations
    if (data.recommendations.length > 0) {
      console.log('\n=== Recommendations ===');
      data.recommendations.forEach(rec => {
        console.log(`📌 ${rec.title}: ${rec.description}`);
      });
    }
    
    return data;
  }
}

// Example usage
calculateVisaTimeline('2026-06-15', 'AU');
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "daysUntilTrip": 45,
      "visaType": "E_VISA",
      "processingTime": {
        "min": 3,
        "max": 10,
        "buffer": 5,
        "unit": "business days"
      }
    },
    "keyDates": {
      "travelDate": "2026-06-15T00:00:00.000Z",
      "latestSubmissionDate": "2026-05-25T00:00:00.000Z",
      "recommendedStartDate": "2026-05-11T00:00:00.000Z",
      "expectedDecisionDate": "2026-05-28T00:00:00.000Z"
    },
    "peakSeason": {
      "isPeakSeason": true,
      "seasonName": "Summer",
      "impact": "Processing times may be 30-50% longer during this period"
    },
    "riskAssessment": {
      "level": "MEDIUM",
      "message": "Peak season may cause delays. Apply early.",
      "color": "yellow",
      "daysMargin": 10,
      "factors": [
        "Peak season: Summer",
        "Processing: 10 business days",
        "Buffer: 5 days"
      ]
    },
    "milestones": [
      {
        "milestoneType": "START_APPLICATION",
        "name": "Begin Application Process",
        "description": "Start gathering required documents",
        "dueDate": "2026-05-11T00:00:00.000Z",
        "order": 1
      },
      {
        "milestoneType": "SUBMIT_APPLICATION",
        "name": "Submit Visa Application",
        "description": "Submit online application",
        "dueDate": "2026-05-25T00:00:00.000Z",
        "order": 2
      }
    ],
    "recommendations": [
      {
        "priority": 3,
        "type": "OPTIMAL_TIMING",
        "title": "Good Timing",
        "description": "You have plenty of time. Start preparing documents now for a stress-free process."
      }
    ]
  }
}
```

---

## 5. Multi-Country Trip Planner

> **What it does**: Analyzes if a multi-country trip is feasible and tells you the best order to apply for visas.

### Analyze Trip Feasibility

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/trips/plan` |
| **Method** | `POST` |
| **Authentication** | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `passportCountry` | String | No | Your passport country (uses profile if not provided) |
| `destinations` | Array | ✅ Yes | List of countries with dates |
| `purpose` | String | No | Trip purpose. Default: "TOURISM" |

Each destination in the array should have:

| Field | Type | Description |
|-------|------|-------------|
| `countryCode` | String | Country code (e.g., "TH") |
| `arrivalDate` | String | When you arrive (e.g., "2026-03-15") |
| `departureDate` | String | When you leave |

#### Complete Example

```javascript
async function analyzeMultiCountryTrip() {
  const token = localStorage.getItem('authToken');
  
  // Plan a trip: Thailand → Vietnam → Cambodia
  const tripPlan = {
    passportCountry: 'NG',  // Nigerian passport
    purpose: 'TOURISM',
    destinations: [
      {
        countryCode: 'TH',           // Thailand
        arrivalDate: '2026-03-15',
        departureDate: '2026-03-22'
      },
      {
        countryCode: 'VN',           // Vietnam
        arrivalDate: '2026-03-22',
        departureDate: '2026-03-28'
      },
      {
        countryCode: 'KH',           // Cambodia
        arrivalDate: '2026-03-28',
        departureDate: '2026-04-03'
      }
    ]
  };
  
  const response = await fetch('http://localhost:3000/api/v1/trips/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(tripPlan)
  });
  
  const result = await response.json();
  
  if (result.success) {
    const data = result.data;
    
    // Overall feasibility
    console.log('=== Trip Feasibility ===');
    console.log(`Status: ${data.feasibilityStatus}`);  // FEASIBLE, RISKY, or IMPOSSIBLE
    console.log(`Score: ${data.feasibilityScore}/100`);
    console.log(`Message: ${data.feasibilityMessage}`);
    
    // Summary
    console.log('\n=== Summary ===');
    console.log(`Total destinations: ${data.summary.totalDestinations}`);
    console.log(`Visa-free destinations: ${data.summary.visaFreeDestinations}`);
    console.log(`Visas needed: ${data.summary.visasRequired}`);
    console.log(`Issues found: ${data.summary.issueCount}`);
    
    // Each destination
    console.log('\n=== Destinations ===');
    data.destinations.forEach(dest => {
      console.log(`\n${dest.countryName} (${dest.countryCode})`);
      console.log(`  Visa: ${dest.visaTypeFriendly}`);
      console.log(`  Arrival: ${dest.arrivalDate}`);
      if (dest.warnings && dest.warnings.length > 0) {
        dest.warnings.forEach(w => console.log(`  ⚠️ ${w.message}`));
      }
    });
    
    // Issues
    if (data.issues.length > 0) {
      console.log('\n=== Issues to Address ===');
      data.issues.forEach(issue => {
        const emoji = issue.severity === 'ERROR' ? '❌' : '⚠️';
        console.log(`${emoji} ${issue.message}`);
        if (issue.suggestedResolution) {
          console.log(`   💡 ${issue.suggestedResolution}`);
        }
      });
    }
    
    // Recommended order
    if (data.optimalApplicationOrder.length > 0) {
      console.log('\n=== Apply for Visas in This Order ===');
      data.optimalApplicationOrder.forEach(item => {
        console.log(`${item.order}. ${item.countryName} (${item.visaType})`);
        console.log(`   Start by: ${item.startBy}`);
      });
    }
    
    // Recommendations
    if (data.recommendations.length > 0) {
      console.log('\n=== Recommendations ===');
      data.recommendations.forEach(rec => {
        console.log(`📌 ${rec.title}: ${rec.description}`);
      });
    }
    
    return data;
  }
}
```

---

## Error Handling

When something goes wrong, the API returns an error response. Here's how to handle them:

### Error Response Format

```json
{
  "success": false,
  "error": "Short error description",
  "message": "Detailed explanation of what went wrong"
}
```

### Common Errors and How to Fix Them

#### 1. Authentication Error (401)

**What you see:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**Why it happens:**
- You didn't include a token
- The token is expired
- The token is incorrect

**How to fix:**
```javascript
// Check if you have a token
const token = localStorage.getItem('authToken');
if (!token) {
  console.log('No token found. User needs to log in.');
  // Redirect to login page
  window.location.href = '/login.html';
}

// If token exists but expired, log in again
async function refreshLogin() {
  // Your login logic
}
```

#### 2. Missing Required Fields (400)

**What you see:**
```json
{
  "error": "passportCountry and destinationCountry are required"
}
```

**Why it happens:**
- You forgot to include required fields in your request

**How to fix:**
```javascript
// WRONG - missing fields
const badRequest = {
  purpose: 'TOURISM'
};

// CORRECT - all required fields included
const goodRequest = {
  passportCountry: 'US',     // Required
  destinationCountry: 'TH',  // Required
  purpose: 'TOURISM'         // Optional but good to include
};
```

#### 3. Not Found (404)

**What you see:**
```json
{
  "error": "Application not found"
}
```

**Why it happens:**
- The ID you're looking for doesn't exist
- The item was deleted
- You're looking in the wrong account

**How to fix:**
```javascript
// Double-check the ID
const applicationId = '507f1f77bcf86cd799439011';  // Make sure this is correct

// Handle the 404 gracefully
if (response.status === 404) {
  console.log('This application no longer exists');
  // Show a message to the user
  // Maybe refresh the list of applications
}
```

#### 4. Server Error (500)

**What you see:**
```json
{
  "error": "Internal server error",
  "message": "Something went wrong on our end"
}
```

**Why it happens:**
- The server has a bug
- Database connection issue
- Temporary problem

**How to fix:**
```javascript
// Wait and try again
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 500 && i < maxRetries - 1) {
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### Complete Error Handling Pattern

```javascript
async function makeApiRequest(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Check for success
    if (response.ok && data.success) {
      return { success: true, data: data.data };
    }
    
    // Handle specific error codes
    switch (response.status) {
      case 400:
        return { 
          success: false, 
          error: 'Invalid request', 
          details: data.message,
          action: 'Check your input data'
        };
        
      case 401:
        // Token expired - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
        return { success: false, error: 'Please log in again' };
        
      case 404:
        return { 
          success: false, 
          error: 'Not found',
          action: 'The item may have been deleted'
        };
        
      case 500:
        return { 
          success: false, 
          error: 'Server error',
          action: 'Please try again in a few minutes'
        };
        
      default:
        return { 
          success: false, 
          error: data.error || 'Unknown error',
          details: data.message
        };
    }
    
  } catch (networkError) {
    // Network failure (no internet, server down, etc.)
    return { 
      success: false, 
      error: 'Network error',
      action: 'Check your internet connection'
    };
  }
}

// Usage
const result = await makeApiRequest(
  'http://localhost:3000/api/v1/visa/lookup',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ passportCountry: 'US', destinationCountry: 'TH' })
  }
);

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.log('Error:', result.error);
  console.log('What to do:', result.action);
}
```

---

## Troubleshooting

### Problem: "fetch is not defined"

**When it happens:** Running in Node.js instead of a browser

**Solution:** Use node-fetch or run in a browser
```javascript
// If using Node.js
// npm install node-fetch
import fetch from 'node-fetch';
```

### Problem: "CORS error"

**When it happens:** Calling API from a different domain

**What you see in console:**
```
Access to fetch at 'http://localhost:3000/...' from origin 'http://localhost:8080' 
has been blocked by CORS policy
```

**Solution:** The server needs to enable CORS. Contact the backend team, or during development:
```javascript
// This is a server-side fix, not something you do in your code
// The backend needs to add:
app.use(cors());
```

### Problem: "Unexpected token < in JSON"

**When it happens:** Server returned HTML instead of JSON

**What it means:** Usually the endpoint doesn't exist or there's a server error

**How to debug:**
```javascript
const response = await fetch(url, options);

// Check what we actually got
console.log('Status:', response.status);
console.log('Headers:', response.headers.get('content-type'));

// Read as text first to see what came back
const text = await response.text();
console.log('Raw response:', text);

// Only parse as JSON if it's actually JSON
if (response.headers.get('content-type')?.includes('application/json')) {
  const data = JSON.parse(text);
  // use data
}
```

### Problem: "Cannot read property 'x' of undefined"

**When it happens:** Trying to access data that doesn't exist

**Solution:** Check if data exists before using it
```javascript
// WRONG - will crash if data.user doesn't exist
const name = result.data.user.name;

// CORRECT - safe access
const name = result.data?.user?.name || 'Unknown';

// EVEN BETTER - explicit check
if (result.success && result.data && result.data.user) {
  const name = result.data.user.name;
} else {
  console.log('User data not available');
}
```

### How to Debug in Browser DevTools

1. **Open DevTools**: Press F12
2. **Go to Network tab**
3. **Make your API request**
4. **Click on the request that appears**
5. **Check these tabs:**
   - **Headers**: See what you sent
   - **Payload/Request**: See the body you sent
   - **Response**: See what came back
   - **Preview**: See it formatted nicely

---

## Complete Examples

### Example 1: Complete Visa Lookup Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Visa Lookup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        select, button { padding: 10px; width: 100%; }
        button { background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; border: 1px solid #ddd; }
        .warning { background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; }
        .success { background: #d4edda; color: #155724; padding: 10px; }
    </style>
</head>
<body>
    <h1>Visa Requirement Lookup</h1>
    
    <div class="form-group">
        <label for="passport">Your Passport Country:</label>
        <select id="passport">
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="NG">Nigeria</option>
            <option value="IN">India</option>
            <option value="ZA">South Africa</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="destination">Destination Country:</label>
        <select id="destination">
            <option value="TH">Thailand</option>
            <option value="AE">UAE</option>
            <option value="AU">Australia</option>
            <option value="KE">Kenya</option>
            <option value="SC">Seychelles</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="purpose">Purpose of Visit:</label>
        <select id="purpose">
            <option value="TOURISM">Tourism</option>
            <option value="BUSINESS">Business</option>
            <option value="TRANSIT">Transit</option>
        </select>
    </div>
    
    <button onclick="lookupVisa()">Check Visa Requirements</button>
    
    <div id="result"></div>

    <script>
        // Configuration
        const API_BASE = 'http://localhost:3000/api/v1';
        
        // Get auth token (you should get this from login)
        function getToken() {
            return localStorage.getItem('authToken');
        }
        
        // Main lookup function
        async function lookupVisa() {
            // Get user selections
            const passport = document.getElementById('passport').value;
            const destination = document.getElementById('destination').value;
            const purpose = document.getElementById('purpose').value;
            
            // Show loading
            document.getElementById('result').innerHTML = '<p>Loading...</p>';
            
            try {
                // Make API request
                const response = await fetch(`${API_BASE}/visa/lookup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: JSON.stringify({
                        passportCountry: passport,
                        destinationCountry: destination,
                        purpose: purpose
                    })
                });
                
                const result = await response.json();
                
                // Display results
                if (result.success) {
                    displayResult(result.data);
                } else {
                    showError(result.error || 'Lookup failed');
                }
                
            } catch (error) {
                showError('Network error: ' + error.message);
            }
        }
        
        // Display the result nicely
        function displayResult(data) {
            let html = `
                <div class="result">
                    <h2>${data.destination.name}</h2>
                    <p><strong>Visa Type:</strong> ${data.visaTypeFriendly}</p>
                    <p><strong>Stay Allowed:</strong> ${data.allowedStayDays || 'Varies'} days</p>
                    <p><strong>Processing Time:</strong> ${data.processingTime.min}-${data.processingTime.max} ${data.processingTime.unit}</p>
                    <p><strong>Cost:</strong> ${data.fees.visaCost ? '$' + data.fees.visaCost + ' ' + data.fees.currency : 'Free'}</p>
                    <p><strong>Passport Validity Required:</strong> ${data.passportValidityDays} days</p>
            `;
            
            // Show pre-arrival requirements
            if (data.preArrivalRequirements && data.preArrivalRequirements.length > 0) {
                html += '<h3>Before You Travel:</h3>';
                data.preArrivalRequirements.forEach(req => {
                    html += `
                        <div class="warning">
                            <strong>${req.name}</strong><br>
                            Complete ${req.advanceHours} hours before arrival<br>
                            <a href="${req.portalUrl}" target="_blank">Apply Here</a>
                        </div>
                    `;
                });
            }
            
            // Show warnings
            if (data.warnings && data.warnings.length > 0) {
                html += '<h3>Important Notices:</h3>';
                data.warnings.forEach(warning => {
                    html += `<div class="warning">${warning.message}</div>`;
                });
            }
            
            html += '</div>';
            document.getElementById('result').innerHTML = html;
        }
        
        // Show error message
        function showError(message) {
            document.getElementById('result').innerHTML = `
                <div class="error">
                    <strong>Error:</strong> ${message}
                </div>
            `;
        }
    </script>
</body>
</html>
```

---

## Country Codes Reference

Here are the ISO codes for the 15 supported countries:

| Country | Code | Region |
|---------|------|--------|
| South Africa | ZA | Africa |
| Ghana | GH | Africa |
| Tanzania | TZ | Africa |
| Rwanda | RW | Africa |
| Kenya | KE | Africa |
| Uganda | UG | Africa |
| Nigeria | NG | Africa |
| Egypt | EG | Africa |
| Madagascar | MG | Africa |
| Seychelles | SC | Africa |
| United Arab Emirates | AE | Middle East |
| Thailand | TH | Asia |
| India | IN | Asia |
| Australia | AU | Oceania |
| Dominican Republic | DO | Caribbean |

---

## Need Help?

If you're stuck:

1. **Check the browser console** for error messages (F12 → Console)
2. **Check the Network tab** to see what was sent and received
3. **Make sure you're logged in** and have a valid token
4. **Verify the URL** matches exactly what's documented
5. **Check that all required fields** are included in your request

Happy coding! 🚀
