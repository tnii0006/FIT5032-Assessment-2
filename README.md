# Elderly Wellbeing Platform

A comprehensive web application designed to support elderly care and digital skills training, featuring serverless cloud functions to meet E1 requirements.

## Features

### Core Services

- **Health Monitoring**: Track vital signs and wellness metrics
- **Digital Skills Training**: Personalized learning programs for seniors
- **Cloud Functions**: Serverless backend services (E1 Requirement)

### Cloud Functions (E1 Implementation)

Our application uses Firebase Cloud Functions to provide serverless backend services:

#### User Management

- `getUsers` - Retrieve user list
- `registerUser` - User registration with validation
- `validateData` - Input data validation

#### Skill Management

- `getUserSkills` - Get user's digital skills
- `addSkill` - Add new skill entry
- `updateSkill` - Update skill information
- `deleteSkill` - Remove skill entry
- `getSkillStats` - Generate skill statistics

#### Data Processing

- `processEmailData` - Email data processing
- `generateReport` - Generate analytical reports
- `backupData` - Data backup operations

#### Analytics

- `analyzeSkills` - Skills analysis and recommendations
- `sendNotification` - Push notifications

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd assessment2
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install Cloud Functions dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Configure Firebase**

   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase (if not already done)
   firebase init functions
   ```

### Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Start Cloud Functions emulator** (in a separate terminal)

   ```bash
   cd functions
   npm run serve
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Cloud Functions Demo: http://localhost:5173/cloud-functions

### Testing Cloud Functions

1. **Local Testing**

   ```bash
   cd functions
   npm run test
   ```

2. **Interactive Demo**
   - Navigate to `/cloud-functions` in the application
   - Click on different function buttons to test them
   - View real-time results and performance metrics

## Project Structure

```
assessment2/
├── functions/                    # Firebase Cloud Functions
│   ├── index.js                 # Main entry point
│   ├── api.js                   # API implementations
│   ├── test-functions.js        # Test scripts
│   └── package.json             # Dependencies
├── src/
│   ├── components/
│   │   └── CloudFunctionsDemo.vue  # Demo component
│   ├── services/
│   │   └── firebaseService.js   # API service layer
│   ├── views/
│   │   └── CloudFunctions.vue   # Demo page
│   └── router/
│       └── index.js             # Route configuration
├── firebase.json               # Firebase configuration
└── README.md                   # This file
```

## E1 Requirements Fulfillment

### ✅ Serverless Functions

- Implemented using Firebase Cloud Functions
- No server management required
- Automatic scaling based on demand

### ✅ Custom Design

- All functions designed specifically for our application needs
- Complex business logic implementation
- Not simple database or API calls

### ✅ Server-side Functionality

- User registration and validation
- Skill data management
- Data analysis and reporting
- Email processing
- Data backup operations

### ✅ Cloud Platform Deployment

- Deployed on Firebase Cloud
- Global accessibility
- High availability and reliability

## API Endpoints

When deployed, Cloud Functions are available at:

```
https://us-central1-[PROJECT_ID].cloudfunctions.net/[FUNCTION_NAME]
```

### Example Usage

```javascript
import { getUsers, addSkill, analyzeSkills } from './services/firebaseService.js'

// Get all users
const users = await getUsers()

// Add a new skill
const skillData = {
  userId: 'user123',
  skillName: 'JavaScript',
  category: 'Programming',
  level: 'Intermediate',
}
const result = await addSkill(skillData)

// Analyze user skills
const analysis = await analyzeSkills('user123')
```

## Deployment

### Deploy Cloud Functions

```bash
cd functions
npm run deploy
```

### Deploy Frontend

```bash
npm run build
# Deploy the dist/ folder to your hosting platform
```

## Monitoring and Maintenance

### View Function Logs

```bash
firebase functions:log
```

### Monitor Performance

- Access Firebase Console > Functions
- View invocation counts, error rates, and response times
- Set up alerts for performance issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues related to:

- **Cloud Functions**: Check `FIREBASE_FUNCTIONS_GUIDE.md`
- **E1 Requirements**: Check `BR_E1_CLOUD_FUNCTIONS_GUIDE.md`
- **General Issues**: Open an issue in the repository
