import { ordersSelectors, ordersActions } from '@slices';
import { useSelector, useDispatch } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  /*DONE* TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ordersActions.getOrders());
  }, []);

  const orders: TOrder[] = useSelector(ordersSelectors.selectOrders);
  const status = useSelector(ordersSelectors.selectGetOrderStatus);
  if (status === 'loading') {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
