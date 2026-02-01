// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// import {
//     auth,
//     googleProvider,
//     db
// } from '../firebase/config';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signInWithPopup,
//     signOut,
//     onAuthStateChanged,
//     updateProfile
// } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Sign up with email/password
    const signup = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, {
                displayName: displayName
            });

            // Create user profile WITHOUT avatarUrl
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName: displayName,
                email: email,
                createdAt: new Date(),
                bio: '',
                favoriteMediums: [],
                collections: []
            });

            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Login with email/password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login with Google
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const userDoc = await getDoc(doc(db, 'users', result.user.uid));

            if (!userDoc.exists()) {
                // Create profile WITHOUT avatarUrl
                await setDoc(doc(db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    displayName: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date(),
                    bio: '',
                    favoriteMediums: [],
                    collections: []
                });
            }

            return result;
        } catch (error) {
            throw error;
        }
    };

    // Logout
    const logout = () => {
        return signOut(auth);
    };

    // Get user profile from Firestore
    const getUserProfile = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    };

    // Update user profile
    const updateUserProfile = async (userId, updates) => {
        try {
            await setDoc(doc(db, 'users', userId), updates, { merge: true });
            setUserProfile(prev => ({ ...prev, ...updates }));
        } catch (error) {
            throw error;
        }
    };

    // Listen for auth state changes
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //         setCurrentUser(user);
    //         if (user) {
    //             await getUserProfile(user.uid);
    //         } else {
    //             setUserProfile(null);
    //         }
    //         setLoading(false);
    //     });

    //     return unsubscribe;
    // }, []);

    useEffect(() => {
        // Firebase disabled: no auth listener
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};