import { CONSTRUCTOR_SLICE_NAME } from '../sliceNames';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type ConstructorInitialState = {
  addedIngredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

const initialState: ConstructorInitialState = {
  addedIngredients: [],
  bun: null
};

export const constructorSlice = createSlice({
  name: CONSTRUCTOR_SLICE_NAME,
  initialState,
  selectors: {
    selectAddedIngredients: (state) => state.addedIngredients,
    selectBun: (state) => state.bun
  },
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.addedIngredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.addedIngredients = state.addedIngredients.filter(
        (elem) => elem.id !== action.payload.id
      );
    },
    deleteAllIngredients: (state) => {
      state.addedIngredients = [];
      state.bun = null;
    },
    moveIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;

      if (
        from < 0 ||
        from >= state.addedIngredients.length ||
        to < 0 ||
        to >= state.addedIngredients.length
      ) {
        return;
      }

      const movedItem = state.addedIngredients[from];
      state.addedIngredients.splice(from, 1);
      state.addedIngredients.splice(to, 0, movedItem);
    }
  }
});

export const constructorSelectors = constructorSlice.selectors;

export const constructorActions = constructorSlice.actions;

export default constructorSlice;
