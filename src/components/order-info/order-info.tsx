import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '@store';
import { ingredientSelectors, ordersActions, ordersSelectors } from '@slices';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /*DONE* TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orders = useSelector(ordersSelectors.selectOrderByNumber);

  useEffect(() => {
    dispatch(ordersActions.getOrderByNumber(Number(number)));
  }, []);

  const orderData = orders.find((elem) => String(elem.number) === number);

  const ingredients: TIngredient[] = useSelector(
    ingredientSelectors.selectIngredients
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
