import React, { useContext, useEffect, useState, useReducer } from "react";
import { auth } from "../firebase";
import firebase from "firebase/app";
const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  user: null,
};

const reducers = (state, { type, payload }) => {
  switch (type) {
    case "SET_USER": {
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...payload },
      };
    }
    case "CLEAR_USER": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    default:
      console.log("default");
      return state;
  }
};

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducers, initialState);

  const signup = (email, password, name) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (auth.currentUser) {
          auth.currentUser
            .updateProfile({
              displayName: name,
            })
            .then((data) => {
              console.log(data);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const googleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const updateEmail = (email) => {
    return state.user.updateEmail(email);
  };

  const updatePassword = (password) => {
    return state.user.updatePassword(password);
  };

  const updateProfile = (profile) => {
    return state.user.updateProfile(profile);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await dispatch({
          type: "SET_USER",
          payload: user,
        });
        setLoading(false);
      } else {
        await dispatch({
          type: "CLEAR_USER",
        });
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateProfile,
    googleLogin,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
