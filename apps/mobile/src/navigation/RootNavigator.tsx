import React, { useEffect } from 'react';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { BootstrapScreen } from '../screens/BootstrapScreen';
import { useAuthStore } from '../store/authStore';

export function RootNavigator() {
  const { isHydrating, canUseApp, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isHydrating) {
    return <BootstrapScreen />;
  }

  if (!canUseApp()) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}
