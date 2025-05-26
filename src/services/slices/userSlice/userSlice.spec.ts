import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '@thunks';
import { RequestStatus } from '@utils-types';
import { setCookie, deleteCookie } from '../../../utils/cookie';
import * as api from '@api';

jest.mock('../../../utils/cookie');

const mockUser = { email: 'test@mail.ru', name: 'Test User' };
const authResponse = {
  success: true,
  user: mockUser,
  accessToken: 'Bearer abc123',
  refreshToken: 'refresh-xyz'
};

describe('userSlice test', () => {
  const initialState = {
    user: null,
    userStatus: RequestStatus.Idle,
    userCheck: false
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('должен установить статус Loading при registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Loading);
    });

    it('должен успешно зарегистрировать пользователя', async () => {
      jest.spyOn(api, 'registerUserApi').mockResolvedValue(authResponse);

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(registerUser({ email: 'test@mail.ru', name: 'Test User', password: '123' }));

      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'Bearer abc123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-xyz');
    });

    it('должен установить статус Failed при registerUser.rejected', () => {
      const action = { type: registerUser.rejected.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('loginUser', () => {
    it('должен установить статус Loading при loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Loading);
    });

    it('должен успешно залогинить пользователя', async () => {
      jest.spyOn(api, 'loginUserApi').mockResolvedValue(authResponse);

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(loginUser({ email: 'test@mail.ru', password: '123' }));

      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
    });

    it('должен установить статус Failed при loginUser.rejected', () => {
      const action = { type: loginUser.rejected.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('logoutUser', () => {
    it('должен успешно разлогинить пользователя', async () => {
      jest.spyOn(api, 'logoutApi').mockResolvedValue({ success: true });

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      store.dispatch({ type: loginUser.fulfilled.type, payload: authResponse });
      await store.dispatch(logoutUser());

      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('должен установить статус Loading при logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Loading);
    });

    it('должен установить статус Failed при logoutUser.rejected', () => {
      const action = { type: logoutUser.rejected.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('getUser', () => {
    it('должен загрузить пользователя', async () => {
      jest.spyOn(api, 'getUserApi').mockResolvedValue({ success: true, user: mockUser });

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(getUser());

      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('updateUser', () => {
    it('должен обновить данные пользователя', async () => {
      jest.spyOn(api, 'updateUserApi').mockResolvedValue({ success: true, user: mockUser });

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(updateUser({ name: 'Test User' }));

      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('forgotPassword', () => {
    it('должен завершиться успешно', async () => {
      jest.spyOn(api, 'forgotPasswordApi').mockResolvedValue({ success: true });

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(forgotPassword({ email: 'test@mail.ru' }));

      const state = store.getState().user;
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('resetPassword', () => {
    it('должен завершиться успешно', async () => {
      jest.spyOn(api, 'resetPasswordApi').mockResolvedValue({ success: true });

      const store = configureStore({ reducer: { user: userSlice.reducer } });
      await store.dispatch(resetPassword({ password: '123456', token: 'reset-token' }));

      const state = store.getState().user;
      expect(state.userStatus).toBe(RequestStatus.Succeeded);
    });
  });

  describe('setCheckUser', () => {
    it('должен установить флаг userCheck в true', () => {
      const action = { type: userSlice.actions.setCheckUser.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.userCheck).toBe(true);
    });
  });
});
