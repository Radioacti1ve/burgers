import { configureStore } from '@reduxjs/toolkit';
import ingredientSlice from './ingredientSlice';
import { getIngredients } from '@thunks';
import { RequestStatus } from '@utils-types';
import mockIngredients from '../mockIngredients';

describe('ingredientSlice test', () => {
  const initialState = {
    ingredients: [],
    ingredientStatus: RequestStatus.Idle
  };

  it('загрузка ингредиентов', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockIngredients
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        ingredients: ingredientSlice.reducer
      }
    });

    await store.dispatch(getIngredients());

    const state = store.getState().ingredients;

    expect(state.ingredientStatus).toEqual(RequestStatus.Succeeded);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен установить статус "Loading" при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientSlice.reducer(initialState, action);

    expect(state.ingredientStatus).toBe(RequestStatus.Loading);
    expect(state.ingredients).toEqual([]);
  });

  it('должен сохранить ингредиенты и установить статус "Succeeded" при getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientSlice.reducer(initialState, action);

    expect(state.ingredientStatus).toBe(RequestStatus.Succeeded);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен установить статус "Failed" при getIngredients.rejected', () => {
    const action = { type: getIngredients.rejected.type };
    const state = ingredientSlice.reducer(initialState, action);

    expect(state.ingredientStatus).toBe(RequestStatus.Failed);
  });
});
