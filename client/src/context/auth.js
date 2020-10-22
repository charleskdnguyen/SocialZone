import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  loggedUser: null,
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  decodedToken.exp * 1000 < Date.now()
    ? localStorage.removeItem('jwtToken')
    : initialState.loggedUser = decodedToken;
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {
  },
  logout: () => {
  },
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        loggedUser: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        loggedUser: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);

    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');

    dispatch({
      type: 'LOGOUT',
    });
  }

  return (
    <AuthContext.Provider
      value={{
        loggedUser: state.loggedUser,
        login,
        logout
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
