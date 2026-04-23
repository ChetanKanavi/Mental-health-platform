# Firebase Setup Guide

This document explains how Firebase has been set up in the MindfulMe application.

## What's Included

### 1. Firebase Configuration (`/lib/firebase.ts`)
- Initializes Firebase app with your project credentials
- Sets up Firebase Authentication
- Configures Cloud Firestore database
- Exports `auth` and `db` instances for use throughout the app

### 2. Authentication Hook (`/hooks/use-firebase-auth.ts`)
Simple hook for managing user authentication in React components.

**Functions:**
- `signUp(email, password)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `logout()` - Sign out current user

**State:**
- `user` - Current authenticated user or null
- `loading` - Whether auth operation is in progress
- `error` - Any authentication error

**Example usage:**
```tsx
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"

export default function LoginForm() {
  const { signIn, loading, error } = useFirebaseAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password)
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      // Call handleLogin
    }}>
      {error && <p>Error: {error.message}</p>}
      {loading && <p>Loading...</p>}
      {/* Form fields */}
    </form>
  )
}
```

### 3. Firestore Helpers (`/lib/firestore.ts`)
Database helper functions for common operations.

**User Operations:**
- `saveUserProfile(userId, data)` - Save or update user profile
- `getUserProfile(userId)` - Get user profile

**Mood Entry Operations:**
- `saveMoodEntry(userId, moodData)` - Save mood tracking entry
- `getUserMoodEntries(userId, limit)` - Get user's mood history
- `deleteMoodEntry(docId)` - Delete a mood entry

**Assessment Operations:**
- `saveAssessmentResult(userId, assessmentData)` - Save assessment result
- `getUserAssessments(userId, limit)` - Get user's assessment history
- `updateAssessmentResult(docId, data)` - Update assessment result

**Example usage:**
```tsx
import { saveMoodEntry, getUserMoodEntries } from "@/lib/firestore"

// Save a mood entry
await saveMoodEntry(userId, {
  mood: 4,
  emotion: "Happy",
  triggers: ["Work", "Exercise"],
  notes: "Great day!"
})

// Get mood history
const entries = await getUserMoodEntries(userId, 30)
```

## Environment Variables

Make sure these environment variables are set in your `.env.local` or Vercel project settings:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

These are public keys (NEXT_PUBLIC_ prefix) and safe to expose in browser code.

## Firestore Database Structure

The app uses the following Firestore collections:

### `users` Collection
User profile information.
```
{
  userId: string (document ID)
  email: string
  displayName: string (optional)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `moodEntries` Collection
Mood tracking entries.
```
{
  userId: string
  mood: number (1-5)
  emotion: string (e.g., "Happy")
  triggers: string[] (e.g., ["Work", "Sleep"])
  notes: string (optional journal entry)
  createdAt: Timestamp
}
```

### `assessments` Collection
Self-assessment results.
```
{
  userId: string
  assessmentType: string (e.g., "stress-anxiety")
  assessmentTitle: string
  totalScore: number
  maxScore: number
  answers: number[] (array of Likert scale responses)
  completedAt: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Security Rules

Set up these Firestore security rules in Firebase Console:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Users can only read/write their own mood entries
    match /moodEntries/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Users can only read/write their own assessments
    match /assessments/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Next Steps

1. Install Firebase SDK: `npm install firebase`
2. Add environment variables to your project
3. Set up Firestore security rules
4. Use the authentication hook in your login/signup pages
5. Use the Firestore helpers to save and retrieve user data

## Troubleshooting

**Firebase not initializing:**
- Check that all environment variables are set correctly
- Verify your Firebase project is active in the console

**Authentication errors:**
- Check Firestore authentication method is enabled
- Verify email/password auth is enabled in Firebase Console

**Firestore permission errors:**
- Review and update security rules
- Make sure userId matches the authenticated user's UID
