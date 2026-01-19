import {
    createUserWithEmailAndPassword,
    updateProfile as firebaseUpdateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import userApi from '../api/user.api';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await userApi.getCurrentUser();
      setUser(res.data || res);
    } catch (error) {
      console.error('Failed to fetch current user from backend', error);
      // Backend might return 404 if user not synced yet, which is handled by interceptor or create flow
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        
        // Persist token for axios interceptor
        const store = { token: idToken, user: { email: firebaseUser.email, uid: firebaseUser.uid } };
        localStorage.setItem('auth', JSON.stringify(store));
        
        // Sync with backend
        await fetchCurrentUser();
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchCurrentUser]);

  const login = async ({ email, password }, remember = false) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    setToken(idToken);
    const store = { token: idToken, user: { email: userCredential.user.email, uid: userCredential.user.uid } };
    if (remember) {
      localStorage.setItem('auth', JSON.stringify(store));
    } else {
      sessionStorage.setItem('auth', JSON.stringify(store));
    }
    
    await fetchCurrentUser();
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
  };

  const updateProfile = async (updates) => {
    try {
      let res;
      // Map updates to specific API calls if they match the profile sections
      if (updates.personal || updates.name) {
        res = await userApi.updatePersonalProfile(updates.personal || { name: updates.name });
      } else if (updates.contact || updates.phone) {
        res = await userApi.updateContactProfile(updates.contact || { phone: updates.phone });
      } else if (updates.passport) {
        res = await userApi.updatePassportProfile(updates.passport);
      }
      
      // Refresh the whole user object from backend to ensure consistency
      await fetchCurrentUser();
      return res;
    } catch (error) {
      console.error('Profile update failed', error);
      throw error;
    }
  };

  const register = async ({ name, email, password } , remember = true) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (name) {
      await firebaseUpdateProfile(userCredential.user, { displayName: name });
    }

    const idToken = await userCredential.user.getIdToken();
    setToken(idToken);
    
    const store = { token: idToken, user: { email: userCredential.user.email, uid: userCredential.user.uid, name: name } };
    if (remember) {
      localStorage.setItem('auth', JSON.stringify(store));
    } else {
      sessionStorage.setItem('auth', JSON.stringify(store));
    }

    // Backend automatically creates user on first request with valid token
    await fetchCurrentUser();
    return userCredential.user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      loading,
      login, 
      logout, 
      updateProfile, 
      register,
      refreshProfile: fetchCurrentUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
