import { db } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"

// User-related operations
export async function saveUserProfile(userId: string, data: Record<string, unknown>) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error saving user profile:", error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? userSnap.data() : null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Mood entries operations
export async function saveMoodEntry(userId: string, moodData: Record<string, unknown>) {
  try {
    const docRef = await addDoc(collection(db, "moodEntries"), {
      userId,
      ...moodData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving mood entry:", error)
    throw error
  }
}

export async function getUserMoodEntries(userId: string, limitCount = 30) {
  try {
    const q = query(
      collection(db, "moodEntries"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting mood entries:", error)
    throw error
  }
}

// Assessment results operations
export async function saveAssessmentResult(userId: string, assessmentData: Record<string, unknown>) {
  try {
    const docRef = await addDoc(collection(db, "assessments"), {
      userId,
      ...assessmentData,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving assessment result:", error)
    throw error
  }
}

export async function getUserAssessments(userId: string, limitCount = 50) {
  try {
    const q = query(
      collection(db, "assessments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting assessments:", error)
    throw error
  }
}

// Update assessment result
export async function updateAssessmentResult(docId: string, data: Record<string, unknown>) {
  try {
    const assessmentRef = doc(db, "assessments", docId)
    await updateDoc(assessmentRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating assessment:", error)
    throw error
  }
}

// Delete mood entry
export async function deleteMoodEntry(docId: string) {
  try {
    await deleteDoc(doc(db, "moodEntries", docId))
  } catch (error) {
    console.error("Error deleting mood entry:", error)
    throw error
  }
}
