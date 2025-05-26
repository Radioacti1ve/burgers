import { rootReducer } from './store';
import { RequestStatus } from '@utils-types';
import {
  userSlice,
  ingredientSlice,
  orderSlice,
  feedSlice,
  constructorSlice
} from '@slices';

describe('rootReducer test', () => {
  it('должен инициализировать все срезы в store', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(ingredientSlice.name);
    expect(state).toHaveProperty(orderSlice.name);
    expect(state).toHaveProperty(feedSlice.name);
    expect(state).toHaveProperty(constructorSlice.name);

    expect(state).toEqual({
      [constructorSlice.name]: {
        addedIngredients: [],
        bun: null
      },
      [orderSlice.name]: {
        orders: [],
        orderByNumber: [],
        getOrderStatus: RequestStatus.Idle,
        getOrderByNumberStatus: RequestStatus.Idle,
        orderStatus: false,
        total: 0,
        totalToday: 0,
        userOrder: null
      },
      [ingredientSlice.name]: {
        ingredientStatus: RequestStatus.Idle,
        ingredients: []
      },
      [feedSlice.name]: {
        orders: [],
        total: 0,
        totalToday: 0,
        feedStatus: RequestStatus.Idle
      },
      [userSlice.name]: {
        user: null,
        userStatus: RequestStatus.Idle,
        userCheck: false
      }
    });
  });
});
