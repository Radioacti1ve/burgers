import { getOrderByNumber, getOrders, orderBurger } from '@thunks';
import { ORDER_SLICE_NAME } from '../sliceNames';
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder, TOrdersData } from '@utils-types';

export type OrderInitialState = TOrdersData & {
  getOrderStatus: RequestStatus;
  getOrderByNumberStatus: RequestStatus;
  orderByNumber: TOrder[];
  orderStatus: boolean;
  userOrder: TOrder | null;
};

const initialState: OrderInitialState = {
  orders: [],
  orderByNumber: [],
  getOrderStatus: RequestStatus.Idle,
  getOrderByNumberStatus: RequestStatus.Idle,
  orderStatus: false,
  total: 0,
  totalToday: 0,
  userOrder: null
};

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectGetOrderStatus: (state) => state.getOrderStatus,
    selectStatus: (state) => state.orderStatus,
    selectUserOrder: (state) => state.userOrder
  },
  reducers: {
    clearUserOrder: (state) => {
      state.userOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.getOrderStatus = RequestStatus.Loading;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.getOrderStatus = RequestStatus.Succeeded;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrders.rejected, (state) => {
        state.getOrderStatus = RequestStatus.Failed;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.getOrderByNumberStatus = RequestStatus.Loading;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.getOrderByNumberStatus = RequestStatus.Succeeded;
        state.orderByNumber = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.getOrderByNumberStatus = RequestStatus.Failed;
      })

      .addCase(orderBurger.pending, (state) => {
        state.orderStatus = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderStatus = false;
        state.userOrder = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderStatus = false;
      });
  }
});

export const ordersSelectors = orderSlice.selectors;
export const ordersActions = {
  ...orderSlice.actions,
  getOrders,
  getOrderByNumber,
  orderBurger
};

export default orderSlice;
