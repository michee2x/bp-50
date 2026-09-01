import { useEffect, useState } from 'react';
import { FiBell, FiDownload, FiX } from 'react-icons/fi';

const RECONNECT_REMINDER_KEY = 'brandpawa_pending_reconnect_reminder';
const INSTALL_DISMISSED_KEY = 'brandpawa_install_prompt_dismissed';
const IOS_INSTALL_DISMISSED_KEY = 'brandpawa_ios_install_prompt_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosDevice() {
  if (typeof window === 'undefined') return false;

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function PwaManager() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showReconnectToast, setShowReconnectToast] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosInstallHint, setShowIosInstallHint] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setInstallDismissed(window.localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true');
    setIsStandalone(isStandaloneMode());
    setShowIosInstallHint(
      isIosDevice() &&
      !isStandaloneMode() &&
      window.localStorage.getItem(IOS_INSTALL_DISMISSED_KEY) !== 'true'
    );

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      setInstallDismissed(false);
      window.localStorage.removeItem(INSTALL_DISMISSED_KEY);
    };

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
      setIsStandalone(true);
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    };

    const handleOffline = () => {
      window.localStorage.setItem(RECONNECT_REMINDER_KEY, 'true');
    };

    const handleOnline = async () => {
      const hadReminderPending = window.localStorage.getItem(RECONNECT_REMINDER_KEY) === 'true';

      if (!hadReminderPending) return;

      window.localStorage.removeItem(RECONNECT_REMINDER_KEY);
      setShowReconnectToast(true);
      window.setTimeout(() => setShowReconnectToast(false), 7000);

      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.error('Notification permission request failed:', error);
        }
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          await registration?.showNotification('You are back online', {
            body: 'Continue your BrandPawa test, quiz, or challenge.',
            icon: '/android-chrome-192x192.png',
            badge: '/favicon-32x32.png',
            tag: 'brandpawa-reconnect-reminder',
            data: { url: '/dashboard' },
          });
        } catch (error) {
          console.error('Reconnect notification failed:', error);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPromptEvent) return;

    await installPromptEvent.prompt();
    const choice = await installPromptEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setInstallPromptEvent(null);
      setIsStandalone(true);
    }
  };

  const dismissInstallPrompt = () => {
    setInstallDismissed(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    }
  };

  const dismissIosInstallHint = () => {
    setShowIosInstallHint(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(IOS_INSTALL_DISMISSED_KEY, 'true');
    }
  };

  const showInstallPrompt = Boolean(installPromptEvent) && !installDismissed && !isStandalone;

  return (
    <>
      {showReconnectToast && (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-center">
          <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-2 text-emerald-600">
              <FiBell className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Back online</p>
              <p className="text-sm text-slate-600">Your connection is back. BrandPawa is ready when you are.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowReconnectToast(false)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss reconnect reminder"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showInstallPrompt && (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[65] flex justify-center sm:justify-end">
          <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-3xl bg-slate-950 px-4 py-4 text-white shadow-2xl">
            <div className="rounded-2xl bg-white/10 p-2.5">
              <FiDownload className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Install BrandPawa</p>
              <p className="mt-1 text-sm text-white/70">Add the app to your phone for faster access and reconnect reminders.</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstall}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Install app
                </button>
                <button
                  type="button"
                  onClick={dismissInstallPrompt}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showIosInstallHint && (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[64] flex justify-center sm:justify-end">
          <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-3xl bg-slate-950 px-4 py-4 text-white shadow-2xl">
            <div className="rounded-2xl bg-white/10 p-2.5">
              <FiDownload className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Install on iPhone</p>
              <p className="mt-1 text-sm text-white/70">
                Open Safari share, then tap Add to Home Screen to install BrandPawa on your phone.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissIosInstallHint}
              className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Dismiss iPhone install hint"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
