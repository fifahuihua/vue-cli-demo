import request from '@/utils/request';

const login = (data) => {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  });
};

const signout = () => {
  return request({
    url: '/api/admin/logout',
    method: 'post'
  });
};

const getUserList = (username, offset = 0, limit = 20) => {
  return request({
    url: '/api/user/search',
    method: 'post',
    data: { username, offset, limit }
  });
};

const isExistedUser = (userId) => {
  return request({
    url: '/api/user/isExist',
    method: 'get',
    params: { userId: userId }
  });
};

const createUser = (data) => {
  return request({
    url: '/api/user',
    method: 'post',
    data
  });
};

const deleteUser = (id) => {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  });
};

const editUser = (user) => {
  const id = user.id;
  delete user.id;
  return request({
    url: `/api/user/${id}`,
    method: 'put',
    data: user
  });
};

const resetPassword = (id, password) => {
  return request({
    url: `/api/user/resetPassword`,
    method: 'post',
    data: {
      id,
      password
    }
  });
};

const getAdminInfo = () => {
  return request({
    url: '/api/admin/info',
    method: 'get'
  });
};

const getUserCount = (username) => {
  return request({
    url: '/api/user/count',
    method: 'get',
    params: { username }
  });
};

const checkSession = () => {
  return request({
    url: '/api/user/checkSession',
    method: 'get'
  });
};

export default {
  login,
  signout,
  getUserList,
  isExistedUser,
  createUser,
  deleteUser,
  editUser,
  resetPassword,
  getAdminInfo,
  getUserCount,
  checkSession
};
