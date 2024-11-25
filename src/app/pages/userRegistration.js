import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import app from '../Tools/firebaseConfig.js'; 

import { userRegistrationStyle } from '../Styles/userRegistrationStyle.js';

const UserRegistration = () => {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [ci, setCi] = useState('');
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');


  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const docRef = await addDoc(collection(db, "User"), {
        firstName: name,
        lastName: lastName,
        secondLastName: secondLastName,
        birthDate: birthdate,
        phone: phone,
        email: email,
        password: password,
        address: address,
        ci: ci,
        role: role,
        userName: userName,
        registerDate: new Date(),
        status: true,
      });

      //aqui usamos las alertas del herbitas
      Swal.fire({
        title: "Registro exitoso",
        text: "El usuario ha sido registrado correctamente.",
        icon: "success"
      });


      setName('');
      setLastName('');
      setSecondLastName('');
      setBirthdate('');
      setPhone('');
      setEmail('');
      setPassword('');
      setAddress('');
      setCi('');
      setRole('');
      setUserName('');

      console.log("Documento añadido con ID: ", docRef.id);
    } catch (e) {
      console.error("Error añadiendo documento: ", e);

      Swal.fire({
        title: "Error",
        text: "Hubo un problema al registrar el usuario.",
        icon: "error"
      });
    }
  };
  return (
    <div style={userRegistrationStyle.container}>
      <div style={userRegistrationStyle.registrationCard}>
        <h2 style={userRegistrationStyle.registrationTitle}>Registro</h2>
        <div style={userRegistrationStyle.underline}></div>

        <form onSubmit={handleSubmit} style={userRegistrationStyle.registrationForm}>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Segundo Apellido</label>
            <input
              type="text"
              placeholder="Segundo Apellido"
              value={secondLastName}
              onChange={(e) => setSecondLastName(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>

          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Fecha de Nacimiento</label>
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={{ ...userRegistrationStyle.formGroup, ...userRegistrationStyle.formGroupFullWidth }}>
            <label style={userRegistrationStyle.formLabel}>Dirección</label>
            <input
              type="text"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Teléfono</label>
            <input
              type="text"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Carnet de Identidad</label>
            <input
              type="text"
              placeholder="Carnet de Identidad"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Rol</label>
            <input
              type="text"
              placeholder="Rol (Admin o Usuario)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Nombre de Usuario</label>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formGroup}>
            <label style={userRegistrationStyle.formLabel}>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={userRegistrationStyle.formInput}
            />
          </div>
          <div style={userRegistrationStyle.formButtons}>
            <button type="submit" style={{ ...userRegistrationStyle.btn, ...userRegistrationStyle.btnRegister }}>
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
