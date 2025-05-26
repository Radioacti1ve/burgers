import { configureStore } from '@reduxjs/toolkit';
import feedSlice from './feedSlice';
import { getFeed } from '@thunks';
import { RequestStatus } from '@utils-types';

const mockFeedData = {
  success: true,
  orders: [
    {
      _id: '6818ea9de8e61d001cec637a',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Био-марсианский флюоресцентный люминесцентный бессмертный бургер',
      createdAt: '2025-05-05T16:43:09.051Z',
      updatedAt: '2025-05-05T16:43:09.770Z',
      number: 76331
    },
    {
      _id: '6818e8b2e8e61d001cec6374',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-05-05T16:34:58.507Z',
      updatedAt: '2025-05-05T16:34:59.251Z',
      number: 76330
    }
  ],
  total: 99999,
  totalToday: 321
};

describe('feedSlice test', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    feedStatus: RequestStatus.Idle
  };

  it('загрузка заказов', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(mockFeedData)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        feed: feedSlice.reducer
      }
    });

    await store.dispatch(getFeed());

    const state = store.getState().feed;

    expect(state.feedStatus).toEqual(RequestStatus.Succeeded);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
  });

  it('должен установить статус "Loading" при getFeed.pending', () => {
    const action = { type: getFeed.pending.type };
    const state = feedSlice.reducer(initialState, action);

    expect(state.feedStatus).toBe(RequestStatus.Loading);
    expect(state.orders).toEqual([]);
  });

  it('должен сохранить заказы и установить статус "Succeeded" при getFeed.fulfilled', () => {
    const action = {
      type: getFeed.fulfilled.type,
      payload: {
        orders: mockFeedData.orders,
        total: mockFeedData.total,
        totalToday: mockFeedData.totalToday
      }
    };
    const state = feedSlice.reducer(initialState, action);

    expect(state.feedStatus).toBe(RequestStatus.Succeeded);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
  });

  it('должен установить статус "Failed" при getFeed.rejected', () => {
    const action = { type: getFeed.rejected.type };
    const state = feedSlice.reducer(initialState, action);

    expect(state.feedStatus).toBe(RequestStatus.Failed);
  });
});
