import { Store } from "@tanstack/react-store";

const loadFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
};

const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

const store = new Store<any>({
  token: loadFromLocalStorage('token'),
  user: loadFromLocalStorage('user'),
});

export const saveToken = (token: string) => {
  store.setState((state) => ({
    ...state,
    token,
  }));
  saveToLocalStorage('token', token);
};

export const removeToken = () => {
  store.setState((state) => ({
    ...state,
    token: null,
  }));
  removeFromLocalStorage('token');
};

export const saveUser = (userData: any) => {
  store.setState((state) => ({
    ...state,
    user: userData,
  }));
  saveToLocalStorage('user', userData);
};

export const removeUser = () => {
  store.setState((state) => ({
    ...state,
    user: null,
  }));
  removeFromLocalStorage('user');
};

export const profile = (email: string) => {
  const updatedUser = {
    ...store.state.user,
    email,
  };
  store.setState((state) => ({
    ...state,
    user: updatedUser,
  }));
  saveToLocalStorage('user', updatedUser);
};

export const clearAllStoredData = () => {
  store.setState(() => ({
    token: null,
    user: null,
  }));
  removeFromLocalStorage('token');
  removeFromLocalStorage('user');
};

export const isUserLoggedIn = () => {
  return store.state.user !== null;
};

export const getCurrentUser = () => {
  return store.state.user;
};

export const getToken = () => {
  return store.state.token;
};

// export default store;