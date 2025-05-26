import constructorSlice, { constructorActions } from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import mockIngredients from '../mockIngredients';

const bunIngredient = mockIngredients.find(i => i.type === 'bun')!;
const sauce = mockIngredients.find(i => i.name.includes('Space Sauce'))!;
const main1 = mockIngredients.find(i => i.name.includes('тетраодонтимформа'))!;
const main2 = mockIngredients.find(i => i.name.includes('метеорит'))!;

describe('constructorSlice test', () => {
  it('должен возвращать начальное состояние', () => {
    expect(constructorSlice.reducer(undefined, { type: '' })).toEqual({
      addedIngredients: [],
      bun: null
    });
  });

  it('должен добавлять ингредиент (bun)', () => {
    const action = constructorActions.addIngredient(bunIngredient);
    const newState = constructorSlice.reducer(undefined, action);

    expect(newState.bun?.name).toBe(bunIngredient.name);
    expect(newState.bun?.id).toBeDefined();
    expect(newState.addedIngredients).toHaveLength(0);
  });

  it('должен добавлять ингредиент (main)', () => {
    const action = constructorActions.addIngredient(main1);
    const newState = constructorSlice.reducer(undefined, action);

    expect(newState.addedIngredients.length).toBe(1);
    expect(newState.addedIngredients[0].name).toBe(main1.name);
    expect(newState.addedIngredients[0].id).toBeDefined();
    expect(newState.bun).toBeNull();
  });

  it('должен удалять ингредиент по id', () => {
    const withId = { ...sauce, id: 'xyz' };
    const initialState = {
      addedIngredients: [withId],
      bun: null
    };

    const action = constructorActions.deleteIngredient(withId);
    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.addedIngredients).toHaveLength(0);
  });

  it('должен менять порядок ингредиентов', () => {
    const ingredient1: TConstructorIngredient = { ...main1, id: '1' };
    const ingredient2: TConstructorIngredient = { ...main2, id: '2' };

    const initialState = {
      addedIngredients: [ingredient1, ingredient2],
      bun: null
    };

    const action = constructorActions.moveIngredient({ from: 0, to: 1 });
    const newState = constructorSlice.reducer(initialState, action);

    expect(newState.addedIngredients[0].id).toBe('2');
    expect(newState.addedIngredients[1].id).toBe('1');
  });

  it('не должен менять порядок при неправильных индексах', () => {
    const ingredient1: TConstructorIngredient = { ...main1, id: '1' };
    const ingredient2: TConstructorIngredient = { ...main2, id: '2' };

    const initialState = {
      addedIngredients: [ingredient1, ingredient2],
      bun: null
    };

    const action = constructorActions.moveIngredient({ from: -1, to: 5 });
    const newState = constructorSlice.reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});