import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(undefined)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u)
      if (u) {
        fetchProfile(u.uid)
      } else {
        setProfile(null)
      }
    })
    return unsubscribe
  }, [])

  async function fetchProfile(uid) {
    const snap = await getDoc(doc(db, 'profiles', uid))
    if (snap.exists()) {
      setProfile(snap.data())
    } else {
      const defaultProfile = { full_name: '', avatar_url: '', role: 'agent' }
      await setDoc(doc(db, 'profiles', uid), defaultProfile)
      setProfile(defaultProfile)
    }
  }

  async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  const normalizedUser = firebaseUser
    ? { id: firebaseUser.uid, uid: firebaseUser.uid, email: firebaseUser.email }
    : null

  const value = {
    session: normalizedUser,
    profile,
    user: normalizedUser,
    isLoading: firebaseUser === undefined,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
