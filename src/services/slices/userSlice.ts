import { createSlice } from '@reduxjs/toolkit';
import { USER_SLICE_NAME } from './sliceNames';
import { RequestStatus, TUser } from '@utils-types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '@thunks';

export type UserInitialState = {
  user: TUser | null;
  userStatus: RequestStatus;
  userCheck: boolean;
};

const initialState: UserInitialState = {
  user: null,
  userStatus: RequestStatus.Idle,
  userCheck: false
};

export const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectUserCheck: (state) => state.userCheck,
    selectStatus: (state) => state.userStatus
  },
  reducers: {
    setCheckUser: (state) => {
      state.userCheck = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(loginUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(logoutUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(getUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(updateUser.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      })

      .addCase(resetPassword.pending, (state) => {
        state.userStatus = RequestStatus.Loading;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.userStatus = RequestStatus.Succeeded;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.userStatus = RequestStatus.Failed;
      });
  }
});

export const userSelectors = userSlice.selectors;

export const userActions = {
  ...userSlice.actions,
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword
};

export default userSlice;
