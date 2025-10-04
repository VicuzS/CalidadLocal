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

  const login = async (credentials) => { // Remover el parámetro userRole
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
      console.log("Respuesta completa del backend:", data);

      if (response.ok && data.success === true) {
        let userData = data.user || {};
        
        // Remover la validación de rol
        // Ya no verificamos si el rol coincide

        const userSession = {
          id: userData.idPersona,
          username: userData.correo,
          role: userData.tipo,
          name: `${userData.nombres} ${userData.apellidoP} ${userData.apellidoM}`,
          email: userData.correo,
          nombres: userData.nombres,
          apellidoP: userData.apellidoP,
          apellidoM: userData.apellidoM,
        };
        
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

  const logout = async () => {
    try {
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
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

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