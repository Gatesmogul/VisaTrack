# VisaTrack Admin - Complete Testing Guide

## Server Information

- **URL**: http://localhost:3001
- **Status**: ✅ Running
- **Database**: MongoDB Atlas (Cloud)

## Quick Start

### 1. Login to Admin Dashboard

1. Go to http://localhost:3001/login
2. Login with your admin credentials (or register a new account if first time)
3. Default test accounts can be created on `/register`

### 2. Test CSV Upload Feature

1. Navigate to "Manage Visas" or go to http://localhost:3001/admin/visas
2. Scroll to "Upload Visa Data" section
3. Click "Choose File" and select `sample-visas.csv` from the project root
4. Click "Upload CSV/JSON" button
5. **Expected Result**: Success message showing "Successfully uploaded X visa requirement(s)"

### 3. Test Manual Entry

1. Click "Add New Visa Requirement" button or go to http://localhost:3001/admin/visas/new
2. Fill in the form:
   - **Country**: Canada
   - **Visa Type**: Work Visa
   - **Requirements**: Passport,Birth Certificate,Police Clearance,Medical Exam
   - **Processing Time**: 20 days
   - **Fees**: 200
3. Click "Add Visa Requirement"
4. **Expected Result**: Redirected to visas list, new entry appears in table

### 4. Test Edit Functionality

1. In the visas list, click "Edit" button on any visa
2. Modify the requirements or other fields
3. Click "Update Visa Requirement"
4. **Expected Result**: Changes saved, redirected to list

### 5. Test Delete Functionality

1. In the visas list, click "Delete" button on any visa
2. Confirm the deletion prompt
3. **Expected Result**: Entry removed from list

### 6. Test Dashboard Statistics

1. Go to http://localhost:3001/admin/dashboard
2. View the statistics cards showing:
   - Total visa requirements
   - Unique countries

## Features Implemented

### ✅ Authentication

- User registration with bcrypt password hashing
- Login with JWT tokens stored in httpOnly cookies
- Protected admin routes (redirect to login if not authenticated)
- Logout functionality

### ✅ Visa CRUD Operations

- **Create**: Add visa requirements manually or via CSV upload
- **Read**: View all visa requirements in table format
- **Update**: Edit existing visa requirements
- **Delete**: Remove visa requirements with confirmation

### ✅ CSV Upload

- Support for CSV file format
- Requirements field uses semicolon (;) as separator in CSV
- Semicolon separated format is converted to array in database
- Error handling for invalid/malformed CSV files
- Success counter showing number of records imported

### ✅ Professional UI

- Gradient background styling (purple theme)
- Responsive navbar with admin badge
- Card-based layouts with shadows and hover effects
- Table with sortable data
- Success and error message displays

## File Format for CSV Upload

**Required columns** (order doesn't matter):

- `country`: Country name (e.g., "Canada")
- `visaType`: Type of visa (e.g., "Tourist Visa", "Work Visa")
- `requirements`: Requirements separated by semicolon (e.g., "Passport;Birth Certificate;Police Clearance")
- `processingTime`: Processing duration (e.g., "15 days", "3 weeks")
- `fees`: Fee amount as number (e.g., "150", "200.50")

**Example CSV format**:

```csv
country,visaType,requirements,processingTime,fees
Canada,Tourist Visa,Passport;Birth Certificate;Police Clearance,15 days,150
USA,Work Visa,Passport;Job Offer;Medical Exam,30 days,190
```

## Troubleshooting

### Port Already in Use

If you see "EADDRINUSE :::3000", the port is already in use:

- Change PORT in `.env` file to another port (e.g., 3001, 3002)
- Or kill the process using the port

### MongoDB Connection Issues

- Verify `.env` has correct `DATABASE_URL`
- Check MongoDB Atlas network access permissions
- Ensure internet connection is active

### CSV Upload Not Working

- Ensure file is in CSV format (.csv extension)
- Check that all required columns are present
- Verify requirements are separated by semicolons (;), not commas
- Check server logs for specific error messages

### Missing Admin Badge

- Log in again to refresh the user session
- Check that `adminName` is being passed correctly in templates

## API Endpoints (For Reference)

### Authentication

- `POST /register` - Register new admin account
- `POST /login` - Login with username/password
- `GET /logout` - Logout and clear session

### Admin Routes (Protected)

- `GET /admin/dashboard` - Main dashboard
- `GET /admin/visas` - List all visa requirements
- `GET /admin/visas/new` - Show add visa form
- `POST /admin/visas` - Create new visa requirement
- `GET /admin/visas/:id/edit` - Show edit form
- `PUT /admin/visas/:id` - Update visa requirement
- `DELETE /admin/visas/:id` - Delete visa requirement
- `POST /admin/visas/upload` - Upload CSV file

### API Routes

- `GET /api/visa-requirements` - Get all visas as JSON (used by dashboard stats)

## Next Steps

After testing all features:

1. **Password Reset**: Implement forgot password feature
2. **User Management**: Add ability to manage other admin accounts
3. **Export Data**: Add export to CSV/JSON functionality
4. **Search & Filter**: Add search and filter capabilities to visa list
5. **Pagination**: Add pagination for large datasets
6. **Audit Logs**: Track changes to visa requirements
