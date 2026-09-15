import { initializeApp, getApps } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'

const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, appId: import.meta.env.VITE_FIREBASE_APP_ID }
const hasConfiguration = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = hasConfiguration ? (getApps()[0] ?? initializeApp(firebaseConfig)) : undefined

export const auth = firebaseApp ? getAuth(firebaseApp) : undefined
export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined
export const firebaseConfigured = hasConfiguration

export async function signIn(email: string, password: string) {
	if (!auth) throw new Error('Firebase is not configured')
	return signInWithEmailAndPassword(auth, email, password)
}

export async function register(email: string, password: string) {
	if (!auth) throw new Error('Firebase is not configured')
	return createUserWithEmailAndPassword(auth, email, password)
}

export async function syncWorkspaceMetadata(userId: string, metadata: Record<string, unknown>) {
	if (!firestore) throw new Error('Firebase is not configured')
	await setDoc(doc(firestore, 'users', userId), { ...metadata, updatedAt: serverTimestamp() }, { merge: true })
}