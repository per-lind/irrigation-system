const TOKEN = 'token';
const USER = 'user';

const parse = JSON.parse;
const stringify = JSON.stringify;

const auth = {
  clearAppStorage() {
    if (sessionStorage) {
      sessionStorage.clear();
    }
  },

  // Returns data from storage
  get(key) {
    if (sessionStorage && sessionStorage.getItem(key)) {
      return parse(sessionStorage.getItem(key)) || null;
    }

    return null;
  },

  getToken() {
    return auth.get(TOKEN);
  },

  getUser() {
    return auth.get(USER);
  },

  // Set data in storage
  set(value, key) {
    if (sessionStorage) {
      if (!value) return sessionStorage.removeItem(key);
      return sessionStorage.setItem(key, stringify(value));
    }

    return null;
  },

  setToken(value) {
    return auth.set(value, TOKEN);
  },

  setUser(value) {
    return auth.set(value, USER);
  }
};

export default auth;
