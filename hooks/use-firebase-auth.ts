import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from "firebase/auth"

interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export function useFirebaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      })
    })

    return () => unsubscribe()
  }, [])

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      const result = await createUserWithEmailAndPassword(auth, email, password)
      setAuthState({
        user: result.user,
        loading: false,
        error: null,
      })
      return result.user
    } catch (error) {
      const authError = error as AuthError
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      const result = await signInWithEmailAndPassword(auth, email, password)
      setAuthState({
        user: result.user,
        loading: false,
        error: null,
      })
      return result.user
    } catch (error) {
      const authError = error as AuthError
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }))
      await signOut(auth)
      setAuthState({
        user: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      const authError = error as AuthError
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: authError,
      }))
      throw authError
    }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    logout,
  }
}
