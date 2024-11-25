const userRegistrationStyle = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    registrationCard: {
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#1c1c1e',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    },
    registrationTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '10px',
        color: 'white',
    },
    underline: {
       
        height: '4px',
        backgroundColor: '#10b981',
        marginBottom: '20px',
        alignSelf: 'center',
    },
    registrationForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Esto divide el formulario en dos columnas ojito!!!!!!!!
        gap: '20px', // Espacio entre las columnas y filas en este caso solo 2 pa que no sea muy largo pichon
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroupFullWidth: {
        gridColumn: 'span 2', // Hace que el campo direccion abarque las 2 columnas como en c# xml
    },
    formLabel: {
        fontSize: '14px',
        color: '#a1a1aa',
        marginBottom: '5px',
    },
    formInput: {
        padding: '10px',
        borderRadius: '5px',
        borderWidth: '1px',
        borderColor: '#3f3f46',
        backgroundColor: '#2d2d2f',
        color: 'white',
        fontSize: '16px',
    },
    formButtons: {
        gridColumn: 'span 2', // Hace que el botón de "Registrar" abarque ambas columnas osea SPICH
        display: 'flex',
        justifyContent: 'center',
    },
    btn: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
    },
    btnRegister: {
        backgroundColor: '#10b981',
        color: 'white',
    },
};

export { userRegistrationStyle };
