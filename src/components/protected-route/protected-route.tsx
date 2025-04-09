import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { userSelectors } from '@slices';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isPublic?: boolean;
};

export const ProtectedRoute = ({ children, isPublic }: ProtectedRouteProps) => {
  const user = useSelector(userSelectors.selectUser);
  const checkUser = useSelector(userSelectors.selectUserCheck);
  const location = useLocation();

  if (!checkUser) {
    return <Preloader />;
  }

  if (isPublic && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!isPublic && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
