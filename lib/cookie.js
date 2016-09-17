const cookies = require('js-cookie');

cookies.removeAll = (attributes) => {
  Object.keys(cookies.get()).forEach((cookie) => {
    cookies.remove(cookie, attributes);
  });
};

module.exports = {
  save(value, name, options = { path: '/', secure: global.location.hostname !== 'localhost', expires: 60 * 60 * 24 }) {
    cookies.set(name, value, options);
    return value;
  },
  get(name) {
    let auth = cookies.get(name);
    if (!auth) return '';
    try {
      auth = JSON.parse(auth);
    } catch (e) {
      // console.error(e);
    }
    return auth;
  },
  clear() {
    cookies.removeAll({ path: '/', secure: global.location.hostname !== 'localhost' });
  },
};
