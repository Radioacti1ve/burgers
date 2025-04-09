import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FEED_SLICE_NAME } from '../slices/sliceNames';

export const getIngredients = createAsyncThunk(
  `${FEED_SLICE_NAME}/getIngredients`,
  async () => await getIngredientsApi()
);
