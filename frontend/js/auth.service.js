export const login = async (email, password) => {
    console.log("Intentando iniciar sesión con", email);
    // TODO: Implementar usando signInWithEmailAndPassword de firebase/auth
};

export const register = async (email, password, name) => {
    console.log("Intentando registrar a", name);
    // TODO: Implementar usando createUserWithEmailAndPassword
};

export const logout = async () => {
    console.log("Cerrando sesión...");
    // TODO: Implementar usando signOut de firebase/auth
};

export const onUserChange = (callback) => {
    // TODO: Implementar usan onAuthStateChanged para escuchar sesiones
    // Simulación temporal:
    const mockUser = null; // Cambiar a {uid: 1, email: "test"} para simular login
    callback(mockUser);
};
