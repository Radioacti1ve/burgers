import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FEED_SLICE_NAME } from '../slices/sliceNames';

export const getFeed = createAsyncThunk(
  `${FEED_SLICE_NAME}/getFeed`,
  getFeedsApi
);
