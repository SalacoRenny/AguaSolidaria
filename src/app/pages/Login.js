import React, { useState } from 'react';
import { auth, db } from '../Tools/firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../components/login.css';
import logo from '../assets/logoGrande.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Iniciando proceso de autenticación');

    try {
      // Autenticar usuario con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario autenticado:', user);

      // Obtener el rol del usuario desde la colección "users" en Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Datos del usuario en Firestore:', userData);

        if (userData.role === 'Admin') {
          console.log('Redirigiendo a /dashboard');
          navigate('/AssigmentReport'); // Solo redirige al dashboard si es admin
        } else {
          console.log('Usuario sin rol, no redirige'); 
        }
      } else {
        setError('No se encontró la información del usuario.');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Cisternas App</h2>
          <img src={logo} alt="Logo Cisternas" className="login-logo" />
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-btn">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
