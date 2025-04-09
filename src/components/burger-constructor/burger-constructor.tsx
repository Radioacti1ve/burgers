import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  constructorActions,
  constructorSelectors,
  ordersActions,
  ordersSelectors,
  userSelectors
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.selectUser);
  const navigate = useNavigate();
  const constructorItems = {
    bun: useSelector(constructorSelectors.selectBun),
    ingredients: useSelector(constructorSelectors.selectAddedIngredients)
  };

  const orderRequest = useSelector(ordersSelectors.selectStatus);

  const orderModalData = useSelector(ordersSelectors.selectUserOrder);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const data = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map(
        (elem: TConstructorIngredient) => elem._id
      ),
      constructorItems.bun?._id
    ];
    dispatch(ordersActions.orderBurger(data));
  };

  const closeOrderModal = () => {
    dispatch(constructorActions.deleteAllIngredients());
    dispatch(ordersActions.clearUserOrder());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
