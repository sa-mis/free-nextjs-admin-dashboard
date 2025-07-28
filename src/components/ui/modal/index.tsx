"use client";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string; // Optional title prop for consistent header styling
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full max-w-4xl mx-auto rounded-lg bg-white dark:bg-gray-900 shadow-xl overflow-hidden";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-[99999] p-4">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses} ${className} relative z-[99999]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-lg z-0">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 via-pink-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 animate-spin-slow opacity-50"></div>
          <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-red-500 via-pink-500 via-purple-500 to-blue-500 animate-spin-slow-reverse opacity-50"></div>
          <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-900 animate-border-glow-rgb"></div>
        </div>
        
        {/* Modal content with higher z-index */}
        <div className="relative z-10">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          <div className="max-h-[90vh] overflow-y-auto relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
