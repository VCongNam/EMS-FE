import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PWAContext = createContext();

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setIsInstallable(false);
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(null);
      setIsInstalled(true);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (isInstalled) {
      toast.info('Ứng dụng đã được cài đặt trên thiết bị của bạn');
      return;
    }

    if (!deferredPrompt) {
      // Check for iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        toast.info('Để cài đặt trên iOS: Nhấn vào biểu tượng "Chia sẻ" và chọn "Thêm vào MH chính"');
      } else {
        toast.warn('Trình duyệt của bạn không hỗ trợ cài đặt tự động hoặc ứng dụng đã được cài đặt');
      }
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <PWAContext.Provider value={{ isInstallable, isInstalled, installApp }}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
