import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { constructorActions } from '@slices';
import { useDispatch } from '@store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          constructorActions.moveIngredient({ from: index, to: index - 1 })
        );
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          constructorActions.moveIngredient({ from: index, to: index + 1 })
        );
      }
    };

    const handleClose = () => {
      dispatch(constructorActions.deleteIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
