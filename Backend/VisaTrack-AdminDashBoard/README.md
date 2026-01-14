# VisaTrack Admin Dashboard

## Overview
VisaTrack is a web application designed to help manage visa requirements efficiently. This project utilizes Node.js, Express, and MongoDB to provide a robust backend for handling visa data.

## Features
- Admin dashboard for managing visa requirements.
- Create, read, update, and delete (CRUD) operations for visa requirements.
- User authentication middleware to secure admin routes.
- Responsive design for ease of use.

## Project Structure
```
visatrack-admin
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── adminController.js
│   │   └── visaController.js
│   ├── models
│   │   └── VisaRequirement.js
│   ├── routes
│   │   ├── admin.js
│   │   └── api.js
│   ├── services
│   │   └── visaService.js
│   ├── middlewares
│   │   └── auth.js
│   ├── views
│   │   ├── layouts
│   │   │   └── admin.ejs
│   │   ├── admin
│   │   │   ├── dashboard.ejs
│   │   │   ├── visas.ejs
│   │   │   └── visa-form.ejs
│   │   └── partials
│   │       ├── header.ejs
│   │       └── footer.ejs
│   └── public
│       ├── css
│       │   └── admin.css
│       └── js
│           └── admin.js
├── tests
│   └── admin.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd visatrack-admin
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Set up your environment variables by copying `.env.example` to `.env` and updating the values accordingly.

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Access the admin dashboard at `http://localhost:3000/admin`.

## Testing
Run the tests using:
```
npm test
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.