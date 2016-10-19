const cookies = require('js-cookie');

module.exports = {
  save(value, name, options = { path: '/', secure: global.location.hostname !== 'localhost', expires: 60 * 60 * 24 * 7 }) {
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
  remove(name) {
    return cookies.remove(name, { path: '/', secure: global.location.hostname !== 'localhost' });
  },
  deleteUser(username) {
    const lastUsers = this.get('last_users');
    const index = lastUsers.indexOf(username);
    if (index >= 0) {
      lastUsers.splice(index, 1);
      this.save(lastUsers, 'last_users');
    }
  },
};
