// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { loginUser as loginUserApi } from '../api/authApi';
// import { jwtDecode } from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedUser = jwtDecode(token);
//         const isExpired = decodedUser.exp * 1000 < Date.now();
//         if (!isExpired) {
//           setUser({
//             token,
//             id: decodedUser.id,
//             email: decodedUser.email,
//             role: decodedUser.role,
//             collegeId: decodedUser.collegeId,
//             name: decodedUser.name // Decode the name
//           });
//         } else {
//           localStorage.removeItem('token');
//         }
//       }
//     } catch (error) {
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     const response = await loginUserApi({ email, password });
//     const { token } = response.data;
//     const decodedUser = jwtDecode(token);
    
//     localStorage.setItem('token', token);
//     const userData = {
//         token,
//         id: decodedUser.id,
//         email: decodedUser.email,
//         role: decodedUser.role,
//         collegeId: decodedUser.collegeId,
//         name: decodedUser.name // Store the name
//     };
//     setUser(userData);
//     return userData;
//   };

//   const logout = () => {
//     setUser(null);               // clear React state
//     localStorage.removeItem('token'); // remove token from storage
//   };
  
//   const value = { user, login, logout, isAuthenticated: !!user };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// File: client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser as loginUserApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only once when the app starts
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (!isExpired) {
          setUser({ token, ...decodedUser });
        } else {
          // If token is expired, remove it
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      // If token is invalid, remove it
      console.error("Error decoding token on initial load:", error);
      localStorage.removeItem('token');
    } finally {
      // This is crucial: always set loading to false so the app can render
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await loginUserApi({ email, password });
    const { token } = response.data;
    const decodedUser = jwtDecode(token);
    const userData = { token, ...decodedUser };
    
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
