// contexts/AlertContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type AlertVariant = "success" | "warning" | "danger" | "info";

export interface Alert {
  id: string;
  variant: AlertVariant;
  message: string;
  duration?: number;
}

interface AlertContextType {
  alerts: Alert[];
  showToast: (alert: {
    variant: AlertVariant;
    message: string;
    duration?: number;
  }) => void;
  removeAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showToast = useCallback(
    ({
      variant,
      message,
      duration = 5000,
    }: {
      variant: AlertVariant;
      message: string;
      duration?: number;
    }) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newAlert: Alert = { id, variant, message, duration };

      setAlerts((prev) => [...prev, newAlert]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showToast, removeAlert, clearAll }}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  );
};

// Alert Container Component
const AlertContainer: React.FC = () => {
  const { alerts } = useAlert();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const { removeAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  React.useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeAlert(alert.id);
    }, 300);
  };

  const getVariantStyles = (variant: AlertVariant) => {
    const baseStyles =
      "relative overflow-hidden backdrop-blur-sm border shadow-lg";

    switch (variant) {
      case "success":
        return `${baseStyles} bg-green-50/95 border-green-200 text-green-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50/95 border-yellow-200 text-yellow-800`;
      case "danger":
        return `${baseStyles} bg-red-50/95 border-red-200 text-red-800`;
      case "info":
        return `${baseStyles} bg-blue-50/95 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50/95 border-gray-200 text-gray-800`;
    }
  };

  const getIconStyles = (variant: AlertVariant) => {
    switch (variant) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "danger":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getIcon = (variant: AlertVariant) => {
    switch (variant) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "danger":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        ${getVariantStyles(alert.variant)}
        rounded-xl p-4 pr-12
        transform transition-all duration-300 ease-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
        ${isLeaving ? "translate-x-full opacity-0 scale-95" : ""}
      `}
    >
      {/* Progress bar */}
      {alert.duration && alert.duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-xl animate-shrink"
          style={{ animationDuration: `${alert.duration}ms` }}
        />
      )}

      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getIconStyles(alert.variant)}`}>
          {getIcon(alert.variant)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-5">{alert.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-4 text-current opacity-60 hover:opacity-100 transition-opacity duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {""}
        </button>
      </div>
    </div>
  );
};

const styles = `
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-shrink {
  animation: shrink linear forwards;
}
`;

export default AlertProvider;
