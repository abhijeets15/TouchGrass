import React, { useEffect } from 'react';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { BootstrapScreen } from '../screens/BootstrapScreen';
import {
  useAuthStore,
  selectCanUseApp,
  selectIsHydrating,
} from '../store/authStore';

export function RootNavigator() {
  const isHydrating = useAuthStore(selectIsHydrating);
  const canUseApp = useAuthStore(selectCanUseApp);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isHydrating) {
    return <BootstrapScreen />;
  }

  if (!canUseApp) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
}
