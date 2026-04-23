# Firebase Integration Guide

This guide documents how Firebase Authentication and Firestore Database are integrated throughout the MindfulMe application.

## Overview

The application uses Firebase for:
- **Authentication**: User signup and login
- **Data Storage**: User profiles, assessment results, and mood entries in Firestore

## Files and Components

### Core Firebase Setup

#### `/lib/firebase.ts`
- Initializes Firebase app with your configuration
- Exports `auth` and `db` instances
- Uses environment variables: `NEXT_PUBLIC_FIREBASE_*`

#### `/hooks/use-firebase-auth.ts`
A React hook that provides authentication functionality:
```typescript
const { user, loading, error, signUp, signIn, logout } = useFirebaseAuth()
```

#### `/lib/firestore.ts`
Helper functions for database operations:
- `saveUserProfile()` - Save user info after signup
- `saveMoodEntry()` - Save daily mood entries
- `saveMoodEntry()` - Save assessment results
- `getUserMoodEntries()` - Fetch mood history
- `getUserAssessments()` - Fetch assessment results

### Page Integration

#### 1. Signup (`/app/signup/page.tsx`)
- Uses `useFirebaseAuth()` hook
- Calls `signUp(email, password)`
- Saves user profile with `saveUserProfile()`
- Fields saved: firstName, lastName, email, createdAt

#### 2. Login (`/app/login/page.tsx`)
- Uses `useFirebaseAuth()` hook
- Calls `signIn(email, password)`
- Handles auth errors with user feedback

#### 3. Dashboard (`/app/dashboard/page.tsx`)
- Loads user profile with `getUserProfile()`
- Displays personalized greeting with user's first name
- Includes logout button that calls `logout()`
- Redirects to login if not authenticated

#### 4. Assessment Results (`/app/assessment/results/page.tsx`)
- Saves assessment results after completion
- Calls `saveAssessmentResult()` with:
  - Assessment type and title
  - Score and level (low/moderate/high)
  - Answers array
  - Completion timestamp

#### 5. Mood Tracker (`/app/mood-tracker/page.tsx`)
- Saves mood entries with `saveMoodEntry()`
- Fields saved:
  - `mood` (1-5)
  - `emotions` (array of selected emotions)
  - `triggers` (array of selected triggers)
  - `note` (journal entry text)
  - `date` (ISO timestamp)
- Falls back to localStorage if not logged in

#### 6. Analytics (`/app/analytics/page.tsx`)
- Fetches mood entries with `getUserMoodEntries()`
- Displays charts with Firebase data
- Falls back to sample data if no entries exist
- Supports weekly and monthly views

## Firestore Database Structure

### Collections

#### `users`
```typescript
{
  uid: string (document ID)
  firstName: string
  lastName: string
  email: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### `assessments`
```typescript
{
  id: string (auto-generated)
  userId: string
  assessmentType: string
  assessmentTitle: string
  score: number
  maxScore: number
  level: "low" | "moderate" | "high"
  answers: number[]
  completedAt: string
  createdAt: Timestamp
}
```

#### `moodEntries`
```typescript
{
  id: string (auto-generated)
  userId: string
  mood: number (1-5)
  emotions: string[]
  triggers: string[]
  note: string
  date: string (ISO format)
  createdAt: Timestamp
}
```

## Firestore Security Rules

Add these rules to your Firestore Database Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Users can only access their own assessments
    match /assessments/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own mood entries
    match /moodEntries/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Data Flow

### Signup Flow
1. User fills signup form
2. `signUp()` creates Firebase auth user
3. `saveUserProfile()` stores user data in Firestore
4. User redirected to dashboard

### Assessment Flow
1. User completes assessment questions
2. Results calculated and stored in sessionStorage
3. `saveAssessmentResult()` stores data in Firestore (if logged in)
4. Results page displays with personalized suggestions

### Mood Tracking Flow
1. User selects mood, emotions, triggers, and optional note
2. `saveMoodEntry()` stores entry in Firestore (if logged in)
3. Entry also saved to localStorage for offline access
4. Recent entries displayed in mood tracker

### Analytics Flow
1. Page loads and checks if user is logged in
2. If logged in: `getUserMoodEntries()` fetches from Firestore
3. If not logged in: Falls back to localStorage
4. Charts rendered with available data
5. Supports switching between weekly and monthly views

## Error Handling

All Firebase operations include:
- Try-catch blocks for error handling
- User-friendly error messages
- Fallback to localStorage when needed
- Console logging for debugging with `[v0]` prefix

Example:
```typescript
try {
  await saveMoodEntry(user.uid, moodData)
  setShowSuccess(true)
} catch (error) {
  console.error("[v0] Error saving mood entry:", error)
  setSaveError("Failed to save mood entry")
}
```

## Offline Support

- Mood entries are cached in localStorage
- Users can track mood offline (saved to localStorage)
- Data syncs to Firestore when connection restored
- Analytics shows localStorage data if Firebase unavailable

## Authentication States

The app handles:
- **Loading**: Initial auth check, data fetches
- **Authenticated**: User logged in, full access to features
- **Unauthenticated**: User not logged in, redirected to login
- **Error**: Auth or data errors shown to user

## Testing

### Create Test Account
1. Go to `/signup`
2. Enter test email: `test@example.com`
3. Password: `Test1234!`
4. Submit form

### Test Data Operations
1. Complete an assessment to test `saveAssessmentResult()`
2. Log a mood entry to test `saveMoodEntry()`
3. Visit analytics to test `getUserMoodEntries()`

### Firebase Console
Monitor all operations in:
1. [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. View Firestore data in real-time
4. Monitor authentication users and events

## Common Issues

### "Expected the module specifier to be a string literal"
- Fixed by removing dynamic imports
- Ensure all Firebase imports are static at top of file

### "CORS errors" or "blocked requests"
- Configure Firebase security rules correctly
- Verify `NEXT_PUBLIC_FIREBASE_*` variables are set

### Data not saving
- Check user is authenticated: `if (user) { ... }`
- Verify Firestore rules allow write access
- Check browser console for specific errors

## Future Enhancements

- Add offline data sync with Service Workers
- Implement real-time updates with `onSnapshot()`
- Add data export/download functionality
- Implement assessment history comparison
- Add mood entry export as CSV/PDF
