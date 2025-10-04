import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials, userRole) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
            email: credentials.username,
            password: credentials.password
        })
      });

      const data = await response.json();
      console.log("Respuesta completa del backend:", data); // Para debug

      if (response.ok && data.success === true) {
        // Tu backend devuelve data.user directamente
        let userData = data.user || {};
        
        // El campo es "tipo", no "tipo_usuario"
        const realUserRole = (userData.tipo || '').toLowerCase();
        const selectedRole = userRole.toLowerCase();

        console.log("Rol real del usuario:", realUserRole); // Para debug
        console.log("Rol seleccionado:", selectedRole); // Para debug

        if (realUserRole !== selectedRole) {
          return { 
            success: false, 
            message: `No tiene permisos para acceder como ${userRole}. Su rol es: ${userData.tipo || 'desconocido'}` 
          };
        }

        // Crear sesión con los campos correctos de tu backend
        const userSession = {
          id: userData.idPersona,
          username: userData.correo,
          role: userData.tipo,
          name: `${userData.nombres} ${userData.apellidoP} ${userData.apellidoM}`,
          email: userData.correo,
          nombres: userData.nombres,
          apellidoP: userData.apellidoP,
          apellidoM: userData.apellidoM,
          // Puedes agregar más campos si los necesitas
        };
        
        // Guardar en estado y localStorage
        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return { 
          success: true, 
          user: userSession, 
          message: data.message || 'Login exitoso'
        };
      } else {
        return { 
          success: false, 
          message: data.message || data.detail || data.error || 'Credenciales inválidas' 
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { 
        success: false, 
        message: 'Error de conexión. Verifique su conexión a internet.' 
      };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Si el usuario tiene token, notificar al backend (opcional)
      if (user?.token) {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        }).catch(() => {
          console.log('No se pudo notificar logout al backend');
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar estado local siempre
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};