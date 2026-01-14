# CSV Upload Format Guide

## Quick Reference

### Column Headers (Required)

```
country,visaType,requirements,processingTime,fees
```

### Data Format

| Column         | Type   | Example                                     | Notes                                              |
| -------------- | ------ | ------------------------------------------- | -------------------------------------------------- |
| country        | String | Canada                                      | Country name (required)                            |
| visaType       | String | Work Visa                                   | Type of visa (required)                            |
| requirements   | String | Passport;Birth Certificate;Police Clearance | Separated by **semicolons** (;) NOT commas         |
| processingTime | String | 15 days                                     | Time duration format (required)                    |
| fees           | Number | 150                                         | Numeric value only, no currency symbols (required) |

## Important Rules

1. **Use SEMICOLONS (;) NOT COMMAS (,) for requirements**

   - ✅ `Passport;Birth Certificate;Police Clearance`
   - ❌ `Passport,Birth Certificate,Police Clearance`

2. **All columns are required** - Missing any will skip the row

3. **Order doesn't matter** - CSV header row determines column mapping

4. **Whitespace is trimmed automatically** - Extra spaces will be removed

5. **Empty lines are skipped** - Multiple blank rows won't cause errors

## Valid CSV Example

```csv
country,visaType,requirements,processingTime,fees
Canada,Tourist Visa,Passport;Birth Certificate;Police Clearance;Medical Exam,15 days,150
United States,Work Visa,Passport;Birth Certificate;Police Clearance;Medical Exam;Job Offer Letter,30 days,190
United Kingdom,Student Visa,Passport;Birth Certificate;Police Clearance;Medical Exam;Acceptance Letter;Financial Proof,14 days,348
Australia,Skilled Migration,Passport;Birth Certificate;Police Clearance;Medical Exam;Skills Assessment;Employment Verification,20 days,310
Germany,Schengen Visa,Passport;Birth Certificate;Police Clearance;Medical Exam;Travel Insurance;Flight Booking,10 days,80
France,Business Visa,Passport;Birth Certificate;Police Clearance;Medical Exam;Business Invitation;Financial Proof,7 days,99
Japan,Work Visa,Passport;Birth Certificate;Police Clearance;Medical Exam;Employment Contract;Graduation Certificate,30 days,220
```

## Error Handling

If a row has issues:

- **Missing required field** → Row is skipped with warning message
- **Invalid fee (non-numeric)** → Row is skipped with warning message
- **Empty requirements** → Row is skipped with warning message
- **Malformed CSV** → Entire upload fails with error message

## How to Create CSV File

### Option 1: Using Excel/LibreOffice

1. Open Excel or LibreOffice Calc
2. Create columns: country, visaType, requirements, processingTime, fees
3. Enter your data
4. For requirements column, use semicolons to separate items
5. Save as CSV (File → Save As → Format: CSV)

### Option 2: Using Text Editor

1. Open Notepad or VS Code
2. Type data in format shown above
3. Save file with `.csv` extension

### Option 3: Using Command Line

```powershell
# Create a CSV file with sample data
@"
country,visaType,requirements,processingTime,fees
Canada,Tourist Visa,Passport;Birth Certificate,15 days,150
USA,Work Visa,Passport;Job Offer;Medical Exam,30 days,190
"@ | Out-File -Path "visas.csv" -Encoding UTF8
```

## Upload Steps

1. Navigate to **Manage Visas** page
2. Scroll to **Upload Visa Data** section
3. Click **Choose File** button
4. Select your CSV file
5. Click **Upload CSV/JSON** button
6. Check for success/error message

## Sample CSV Included

A sample CSV file (`sample-visas.csv`) is included in the project root with 7 sample records ready to upload for testing.

## Troubleshooting

| Problem                            | Solution                                       |
| ---------------------------------- | ---------------------------------------------- |
| "Only CSV files are allowed"       | Ensure file has .csv extension                 |
| "Missing required fields" error    | Verify all 5 columns present                   |
| Requirements not parsing correctly | Check using semicolons (;) not commas (,)      |
| Rows being skipped silently        | Check that fees column has numeric values only |
| "Upload failed" error              | Check server logs for specific error message   |

## Database Result

After successful upload, requirements are stored in database as an **array**:

```javascript
{
  country: "Canada",
  visaType: "Tourist Visa",
  requirements: [
    "Passport",
    "Birth Certificate",
    "Police Clearance",
    "Medical Exam"
  ],
  processingTime: "15 days",
  fees: 150
}
```

Even if you enter them as semicolon-separated string in CSV, they are automatically converted to an array in the database.
