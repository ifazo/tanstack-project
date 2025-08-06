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

export const getToken = () => {
  return store.state.token;
};

export const saveUser = (user: any) => {
  store.setState((state) => ({
    ...state,
    user,
  }));
  saveToLocalStorage('user', user);
};

export const removeUser = () => {
  store.setState((state) => ({
    ...state,
    user: null,
  }));
  removeFromLocalStorage('user');
};

export const getUser = () => {
  return store.state.user;
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

export default store;