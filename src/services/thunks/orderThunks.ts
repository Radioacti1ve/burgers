import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_SLICE_NAME } from '../slices/sliceNames';

export const getOrderByNumber = createAsyncThunk(
  `${ORDER_SLICE_NAME}/getOrderByNumber`,
  async (number: number) => await getOrderByNumberApi(number)
);

export const getOrders = createAsyncThunk(
  `${ORDER_SLICE_NAME}/getOrders`,
  async () => await getOrdersApi()
);

export const orderBurger = createAsyncThunk(
  `${ORDER_SLICE_NAME}/orderBurger`,
  async (data: string[]) => await orderBurgerApi(data)
);
