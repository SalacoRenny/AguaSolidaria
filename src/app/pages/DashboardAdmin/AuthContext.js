import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../Tools/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Añadimos un estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setCurrentUser({
            ...user,
            role: userDoc.exists() ? userDoc.data()?.role : null,
          });
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // Finaliza la carga cuando los datos están listos
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
