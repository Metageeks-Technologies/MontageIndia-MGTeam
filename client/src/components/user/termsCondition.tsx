import React, { useEffect } from 'react';

const TermsModal = ({ isOpen, onClose }:{isOpen:boolean, onClose:any}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
    
        if (isOpen) {
          window.addEventListener('keydown', handleKeyDown);
        }
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
        <p className="mb-4">
        By accessing and using our services, you agree to comply with the following terms and conditions. These terms apply to all users of the service. You must be at least 18 years old or have reached the age of majority in your jurisdiction to use our services. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. We reserve the right to terminate accounts, edit or remove content, and cancel orders at our sole discretion. By using our service, you agree not to use it for any unlawful purpose or to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances. We reserve the right to modify these terms at any time, and you should check this page regularly for updates. Your continued use of the service after any changes constitutes your acceptance of the new terms. If you do not agree with any part of these terms and conditions, you must not use our services.        </p>
        <button
          className="px-4 py-2 bg-webgreen text-white rounded hover:bg-webgreenHover"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
