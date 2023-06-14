import { get, post } from '../utils/request';

export const userLogin = (data) => post('/users/:id', data);
export const getUserInfo = (data) => get('/users/:id', data);
