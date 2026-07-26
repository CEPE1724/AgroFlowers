import { Toaster } from 'sonner';
import { useStore } from '@nanostores/react';
import { themeStore } from '@/stores/uiStore';

export function AppToaster() {
  const theme = useStore(themeStore);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  );
}
