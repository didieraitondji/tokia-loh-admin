import React from 'react';

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-neutral-0 rounded-rounded-h1 shadow-2xl w-full max-w-md p-6 animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icône */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-warning-2 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-warning-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Titre */}
                    <h2 className="text-h4 font-semibold text-neutral-9 text-center mb-2">
                        Confirmer la déconnexion
                    </h2>

                    {/* Message */}
                    <p className="text-body text-neutral-7 text-center mb-6">
                        Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
                    </p>

                    {/* Boutons */}
                    <div className="flex gap-3">
                        {/* Bouton Annuler */}
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 cursor-pointer rounded-md border-2 border-neutral-5 text-neutral-8 font-medium text-body hover:bg-neutral-3 transition-colors"
                        >
                            Annuler
                        </button>

                        {/* Bouton Déconnexion */}
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 cursor-pointer rounded-md bg-danger-1 text-white font-medium text-body hover:bg-[#DC2626] transition-colors"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </>
    );
};

export default LogoutConfirmModal;