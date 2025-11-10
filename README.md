# Framez 📱

A modern, full-featured social media mobile application built with React Native and Firebase. Framez allows users to share posts with text and images, view a chronological feed, and manage their profiles.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- 🔐 **User Authentication**
  - Email/password registration
  - Secure login/logout
  - Persistent user sessions
  - Firebase Authentication integration

- 📝 **Post Management**
  - Create posts with text content
  - Upload and attach images to posts
  - View all posts in chronological feed
  - Delete own posts

- 👤 **User Profiles**
  - View user information (name, email, avatar)
  - Display user's post count
  - View all posts created by user
  - Custom avatar placeholders

- 🎨 **User Interface**
  - Clean, Instagram-inspired design
  - Smooth navigation with React Navigation
  - Bottom tab navigation
  - Pull-to-refresh on feed
  - Responsive layouts for iOS and Android

### Technical Features
- ⚡ Real-time data synchronization with Firestore
- 📸 Image upload to Firebase Storage
- 🔒 Secure authentication with Firebase Auth
- 📱 Cross-platform (iOS & Android)
- 🎯 Type-safe with TypeScript
- 🌐 Hosted on Appetize.io for easy testing

## 📸 Screenshots

> Add your app screenshots here

```
[Login Screen] [Feed Screen] [Create Post] [Profile Screen]
```

## 🛠 Tech Stack

### Frontend
- **React Native** (0.74.0) - Mobile framework
- **Expo** (~51.0.0) - Development platform
- **TypeScript** (5.1.3) - Type safety
- **React Navigation** (6.x) - Navigation library

### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - Image storage
- **Expo Image Picker** - Image selection

### State Management
- **React Context API** - Global state management
- **React Hooks** - Component state

### Development Tools
- **Expo CLI** - Development server
- **TypeScript Compiler** - Type checking
- **ESLint** - Code linting (optional)

## 📁 Project Structure

```
framez-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── PostCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── services/           # Backend service integrations
│   │   ├── authService.ts
│   │   ├── postService.ts
│   │   └── storageService.ts
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── post.types.ts
│   │   └── user.types.ts
│   ├── config/             # App configuration
│   │   └── firebase.ts
│   └── utils/              # Utility functions
│       ├── constants.ts
│       └── helpers.ts
├── App.tsx                 # Root component
├── app.json               # Expo configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Expo CLI** - `npm install -g expo-cli`
- **Git** - Version control
- **iOS Simulator** (Mac only) or **Android Studio** for emulator
- **Expo Go app** on your physical device (optional)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/framez-app.git
cd framez-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: **"Framez"**
4. Follow the setup wizard

### 2. Register Your App

1. In Firebase Console, click the **web icon** (`</>`)
2. Register app with nickname: **"Framez Web"**
3. Copy the Firebase configuration object

### 3. Configure Firebase in Your App

Create `src/config/firebase.ts` and add your config:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### 4. Enable Firebase Services

**Authentication:**
1. Go to **Authentication** → **Get Started**
2. Enable **Email/Password** sign-in method

**Firestore Database:**
1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (development)
3. Choose your region

**Storage:**
1. Go to **Storage** → **Get Started**
2. Start in **test mode** (development)

### 5. Set Security Rules

**Firestore Rules** (`Firestore Database` → `Rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules** (`Storage` → `Rules`):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🏃‍♂️ Running the App

### Development Mode

```bash
# Start Expo development server
npx expo start

# Or with specific platform
npx expo start --ios        # iOS Simulator
npx expo start --android    # Android Emulator
npx expo start --web        # Web browser
```

### Scan QR Code

1. Install **Expo Go** on your mobile device
2. Scan the QR code from the terminal
3. App will load on your device

### Run on Simulator/Emulator

**iOS (Mac only):**
```bash
npx expo start --ios
```

**Android:**
```bash
npx expo start --android
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Create a new account with valid credentials
- [ ] Try creating account with existing email (should fail)
- [ ] Login with created credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout successfully
- [ ] Session persists after app restart

**Posts:**
- [ ] Create a text-only post
- [ ] Create a post with an image
- [ ] Create a post with text and image
- [ ] View posts in feed (sorted newest first)
- [ ] Pull to refresh the feed
- [ ] View own posts on profile
- [ ] Delete a post

**Profile:**
- [ ] View profile information
- [ ] Check post count accuracy
- [ ] Avatar displays correctly (image or placeholder)

**Navigation:**
- [ ] Bottom tab navigation works
- [ ] Back navigation works correctly
- [ ] Deep linking works (if implemented)

### Test on Multiple Devices

- [ ] iOS device/simulator
- [ ] Android device/emulator
- [ ] Different screen sizes
- [ ] Different Android versions

## 📦 Deployment

### Deploy to Appetize.io

1. **Build the app:**
```bash
# For iOS
eas build --platform ios --profile preview

# For Android
eas build --platform android --profile preview
```

2. **Upload to Appetize.io:**
   - Go to [Appetize.io](https://appetize.io/)
   - Create an account
   - Upload your `.app` (iOS) or `.apk` (Android) file
   - Get your public app link

3. **Add to README:**
```markdown
## 🌐 Live Demo

Try Framez without installation: [Launch App](https://appetize.io/app/your-app-id)
```

### Deploy to Expo

```bash
# Build for production
eas build --platform all --profile production

# Submit to App Store/Play Store
eas submit --platform ios
eas submit --platform android
```

## 📚 API Documentation

### Authentication Service

```typescript
// Sign up
await authService.signup(email, password, name);

// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();
```

### Post Service

```typescript
// Create post
await postService.createPost(userId, { content, imageUrl });

// Get all posts
const posts = await postService.getAllPosts();

// Get user posts
const userPosts = await postService.getUserPosts(userId);

// Delete post
await postService.deletePost(postId);
```

### Storage Service

```typescript
// Upload image
const imageUrl = await storageService.uploadImage(uri, userId);

// Delete image
await storageService.deleteImage(imageUrl);
```

## 🗄️ Database Schema

### Users Collection

```typescript
users/{userId}
  - id: string
  - email: string
  - name: string
  - avatar?: string
  - createdAt: timestamp
```

### Posts Collection

```typescript
posts/{postId}
  - userId: string
  - content: string
  - imageUrl?: string
  - timestamp: timestamp
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Add proper type definitions
- Write meaningful commit messages
- Test thoroughly before submitting PR

## 🐛 Known Issues

- Image upload may be slow on poor network connections
- iOS simulator may require camera permissions reset
- Expo Go has limitations compared to development builds

## 🔮 Future Enhancements

- [ ] Like and comment on posts
- [ ] Follow/unfollow users
- [ ] Direct messaging
- [ ] Push notifications
- [ ] Story feature
- [ ] Search functionality
- [ ] Hashtags and mentions
- [ ] Profile editing
- [ ] Dark mode
- [ ] Post sharing
- [ ] Image filters

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- HNG Internship Program

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Email: support@framez.com
- Join our Discord community

---

**Made with ❤️ for HNG13 Frontend Track Stage 4**

## 🌐 Links

- **Live Demo**: [https://appetize.io/app/your-app-id](https://appetize.io/app/your-app-id)
- **GitHub Repository**: [https://github.com/yourusername/framez-app](https://github.com/yourusername/framez-app)
- **Demo Video**: [YouTube Link](https://youtube.com/...)
- **Submission Form**: [Google Form](https://forms.gle/BZxHGH4RvVTzqCHf6)

---

*Built as part of the HNG13 Frontend Track Stage 4 Task*