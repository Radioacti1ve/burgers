import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './orderSlice';
import { getOrders, getOrderByNumber, orderBurger } from '@thunks';
import { RequestStatus } from '@utils-types';

describe('orderSlice test', () => {
  const initialState = {
    orders: [],
    orderByNumber: [],
    getOrderStatus: RequestStatus.Idle,
    getOrderByNumberStatus: RequestStatus.Idle,
    orderStatus: false,
    total: 0,
    totalToday: 0,
    userOrder: null
  };

  describe('orderBurger', () => {
    const mockOrderBurgerResponse = {
      success: true,
      name: 'Фалленианский краторный бургер',
      order: {
        _id: '6818fb1ee8e61d001cec6388',
        ingredients: ['643d69a5c3f7b9001cfa093c'],
        status: 'done',
        name: 'Фалленианский бургер',
        createdAt: '2025-05-05T17:53:34.313Z',
        updatedAt: '2025-05-05T17:53:35.023Z',
        number: 76332,
        price: 8553,
        owner: {
          name: 'Max2282',
          email: 'itisme@mail.ru',
          createdAt: '2025-03-17T14:43:28.493Z',
          updatedAt: '2025-03-20T19:23:33.685Z'
        }
      }
    };

    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockOrderBurgerResponse)
        })
      ) as jest.Mock;
    });

    it('должен сохранить заказ при успешном выполнении orderBurger', async () => {
      const store = configureStore({ reducer: { order: orderSlice.reducer } });
      await store.dispatch(orderBurger([]));

      const state = store.getState().order;
      expect(state.orderStatus).toBe(false);
      expect(state.userOrder).toEqual(mockOrderBurgerResponse.order);
    });

    it('должен установить orderStatus = true при orderBurger.pending', () => {
      const action = { type: orderBurger.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderStatus).toBe(true);
    });

    it('должен сохранить userOrder и сбросить orderStatus при orderBurger.fulfilled', () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockOrderBurgerResponse
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderStatus).toBe(false);
      expect(state.userOrder).toEqual(mockOrderBurgerResponse.order);
    });

    it('должен сбросить orderStatus при orderBurger.rejected', () => {
      const action = { type: orderBurger.rejected.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.orderStatus).toBe(false);
    });
  });

  describe('getOrders', () => {
    const mockGetOrdersResponse = {
      success: true,
      orders: [{ _id: '1', ingredients: ['a'], status: 'done', name: 'Тест', createdAt: '', updatedAt: '', number: 123 }],
      total: 100,
      totalToday: 5
    };

    it('должен установить getOrderStatus = Loading при getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderStatus).toBe(RequestStatus.Loading);
    });

    it('должен сохранить заказы и обновить total/totalToday при getOrders.fulfilled', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGetOrdersResponse)
        })
      ) as jest.Mock;

      const action = {
        type: getOrders.fulfilled.type,
        payload: mockGetOrdersResponse
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderStatus).toBe(RequestStatus.Succeeded);
      expect(state.orders).toEqual(mockGetOrdersResponse.orders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(5);
    });

    it('должен установить getOrderStatus = Failed при getOrders.rejected', () => {
      const action = { type: getOrders.rejected.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('getOrderByNumber', () => {
    const mockGetOrderByNumberResponse = {
      success: true,
      orders: [{ _id: '1', ingredients: ['a'], status: 'done', name: 'Поиск по номеру', createdAt: '', updatedAt: '', number: 123 }]
    };

    it('должен установить getOrderByNumberStatus = Loading при getOrderByNumber.pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderByNumberStatus).toBe(RequestStatus.Loading);
    });

    it('должен сохранить orderByNumber и установить статус Succeeded при getOrderByNumber.fulfilled', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGetOrderByNumberResponse)
        })
      ) as jest.Mock;

      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockGetOrderByNumberResponse
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderByNumberStatus).toBe(RequestStatus.Succeeded);
      expect(state.orderByNumber).toEqual(mockGetOrderByNumberResponse.orders);
    });

    it('должен установить getOrderByNumberStatus = Failed при getOrderByNumber.rejected', () => {
      const action = { type: getOrderByNumber.rejected.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.getOrderByNumberStatus).toBe(RequestStatus.Failed);
    });
  });
});