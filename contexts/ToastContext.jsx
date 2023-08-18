import React, { createContext, useContext, useReducer } from "react";
import Toast from "../components/Toast";
import { toastReducer } from "./toastReducer";
import ToastsContainer from "../components/ToastsContainer";

export const ToastContext = createContext(null);

const initialState = {
  toasts: [],
};

export const ToastContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (type: string, message: string) => {
    const id = Math.floor(Math.random() * 10000000);
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
  };

  const success = (message) => {
    console.log("successing")
    addToast("success", message);
  };

  const warning = (message) => {
    addToast("warning", message);
  };

  const info = (message) => {
    addToast("info", message);
  };

  const error = (message) => {
    addToast("error", message);
  };

  const remove = (id) => {
    dispatch({ type: "DELETE_TOAST", payload: id });
  };

  const value = { success, warning, info, error, remove };
  return (
    <ToastContext.Provider value={value}>
      <ToastsContainer toasts={state.toasts} />
      {children}
    </ToastContext.Provider>
  );
};
