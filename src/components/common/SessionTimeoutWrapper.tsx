/**
 * Session Timeout Wrapper Component
 * SEC-8: Wraps app routes to provide session timeout functionality
 * Shows a warning modal before session expires
 */

import { type ReactNode } from 'react';
import { useSessionTimeout, formatTimeRemaining } from '@/hooks/useSessionTimeout';
import { Modal, ModalFooter } from './Modal';
import { Button } from './Button';

interface SessionTimeoutWrapperProps {
  children: ReactNode;
  /** Whether session timeout is enabled (default: true) */
  enabled?: boolean;
}

export function SessionTimeoutWrapper({
  children,
  enabled = true,
}: SessionTimeoutWrapperProps): JSX.Element {
  const { showWarning, timeRemaining, dismissWarning } = useSessionTimeout({
    enabled,
    timeoutMs: 15 * 60 * 1000, // 15 minutes
    warningMs: 2 * 60 * 1000, // 2 minute warning
  });

  return (
    <>
      {children}

      {/* Session Timeout Warning Modal */}
      <Modal
        isOpen={showWarning}
        onClose={dismissWarning}
        title="Session Expiring Soon"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Your session will expire in
            </p>
            <p className="text-3xl font-bold text-amber-600" aria-live="polite">
              {formatTimeRemaining(timeRemaining)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              For your security, inactive sessions are automatically closed and data is cleared.
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button onClick={dismissWarning} variant="primary">
            Continue Session
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
