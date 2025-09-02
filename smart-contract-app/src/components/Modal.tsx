import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={closeOnOverlayClick ? onClose : () => {}}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    as={motion.div}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all`}
                  >
                    {(title || showCloseButton) && (
                      <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                          {title && (
                            <Dialog.Title
                              as="h3"
                              className="text-xl font-semibold leading-6 text-gray-900"
                            >
                              {title}
                            </Dialog.Title>
                          )}
                          {showCloseButton && (
                            <button
                              type="button"
                              className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={onClose}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        {description && (
                          <Dialog.Description className="mt-2 text-sm text-gray-500">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                    )}

                    <div className="px-6 py-4">{children}</div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
};

export default Modal;