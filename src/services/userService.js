import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  me() {
    return axios.get('/api/users/me');
  },
  saveUserAccount(data) {
    return axios.put('/users/me', data);
  },
  changePassword(data) {
    return axios.post('/api/changePassword', data);
  },
  askMobileAuth(data) {
    return axios.post('/api/users/me/mobile', data);
  },
  saveUserMobile(data) {
    return axios.put('/api/users/me/mobile', data);
  },
};