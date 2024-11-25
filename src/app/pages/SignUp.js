import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Tools/firebaseConfig';
import '../../styles/register.css'; // Archivo CSS personalizado




//SCRIPT POSIBLEMENTE INNECESARIO, LO CREE SOLO PARA PROBAR QUE EL LOGIN FUNCIONA, SE CREA UNA CUENTA MEDIANTE ESTE, Y DESPUES SE PUEDEN INGRESAR CON ESAS
//CREDENCIALES DESDE LA PAGINA DEL LOGIN


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Error al crear la cuenta. Revisa los datos ingresados.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Cisternas App - Registro</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <button type="submit" className="register-btn">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
