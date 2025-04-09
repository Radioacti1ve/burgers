import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_SLICE_NAME } from '../slices/sliceNames';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../../utils/constants';

export const registerUser = createAsyncThunk(
  `${USER_SLICE_NAME}/registerUser`,
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    setCookie(ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  `${USER_SLICE_NAME}/loginUser`,
  async (userData: TLoginData) => {
    const response = await loginUserApi(userData);
    setCookie(ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  `${USER_SLICE_NAME}/logoutUser`,
  async () => {
    const response = await logoutApi();
    deleteCookie(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    return response;
  }
);

export const getUser = createAsyncThunk(
  `${USER_SLICE_NAME}/getUser`,
  async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE_NAME}/updateUser`,
  async (userData: Partial<TRegisterData>) => await updateUserApi(userData)
);

export const forgotPassword = createAsyncThunk(
  `${USER_SLICE_NAME}/forgotPassword`,
  async (data: { email: string }) => await forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  `${USER_SLICE_NAME}/resetPassword`,
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);
