import React from 'react';
import { Clock, CheckCircle, Package, Truck, Star, XCircle, ChevronRight } from 'lucide-react';

// Étapes principales (hors Annulée)
const STEPS = [
    { status: 'En attente', icon: <Clock size={16} /> },
    { status: 'Confirmée', icon: <CheckCircle size={16} /> },
    { status: 'En préparation', icon: <Package size={16} /> },
    { status: 'En livraison', icon: <Truck size={16} /> },
    { status: 'Livrée', icon: <Star size={16} /> },
];

const currentIndex = (status) => STEPS.findIndex(s => s.status === status);

const OrderStatusStepper = ({ status, onStatusChange, disabled = false }) => {
    const isCancelled = status === 'Annulée';
    const activeIndex = currentIndex(status);
    const isFinished = status === 'Livrée';

    const nextStep = STEPS[activeIndex + 1] ?? null;

    return (
        <div className="flex flex-col gap-4">

            {/* Stepper visuel */}
            {isCancelled ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2 bg-danger-2">
                    <XCircle size={16} className="text-danger-1 shrink-0" />
                    <span className="text-xs font-semibold font-poppins text-danger-1">
                        Commande annulée
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {STEPS.map((step, index) => {
                        const isDone = index < activeIndex;
                        const isActive = index === activeIndex;
                        const isPending = index > activeIndex;

                        return (
                            <React.Fragment key={step.status}>
                                {/* Étape */}
                                <div className="flex flex-col items-center gap-1.5 min-w-18">
                                    <div className={`
                                        w-9 h-9 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${isDone ? 'bg-success-1 text-white' : ''}
                                        ${isActive ? 'bg-primary-1 text-white shadow-md' : ''}
                                        ${isPending ? 'bg-neutral-3 dark:bg-neutral-3 text-neutral-5' : ''}
                                    `}>
                                        {step.icon}
                                    </div>
                                    <span className={`
                                        text-[10px] font-poppins text-center leading-tight
                                        ${isDone ? 'text-success-1 font-semibold' : ''}
                                        ${isActive ? 'text-primary-1 font-semibold' : ''}
                                        ${isPending ? 'text-neutral-5 dark:text-neutral-6' : ''}
                                    `}>
                                        {step.status}
                                    </span>
                                </div>

                                {/* Connecteur */}
                                {index < STEPS.length - 1 && (
                                    <div className={`
                                        h-0.5 flex-1 min-w-5 rounded-full mb-4
                                        transition-colors duration-300
                                        ${index < activeIndex ? 'bg-success-1' : 'bg-neutral-4 dark:bg-neutral-4'}
                                    `} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {/* Boutons d'action */}
            {!isCancelled && !isFinished && !disabled && (
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Passer à l'étape suivante */}
                    {nextStep && (
                        <button
                            onClick={() => onStatusChange(nextStep.status)}
                            className="
                                flex items-center gap-2 px-4 py-2 rounded-full
                                bg-primary-1 text-white text-xs font-semibold font-poppins
                                hover:bg-primary-6 transition-colors duration-200
                                shadow-sm cursor-pointer
                            "
                        >
                            Passer à : {nextStep.status}
                            <ChevronRight size={14} />
                        </button>
                    )}

                    {/* Annuler */}
                    <button
                        onClick={() => onStatusChange('Annulée')}
                        className="
                            flex items-center gap-2 px-4 py-2 rounded-full
                            border border-danger-1 text-danger-1 text-xs font-semibold font-poppins
                            hover:bg-danger-2 transition-colors duration-200
                            cursor-pointer
                        "
                    >
                        <XCircle size={14} />
                        Annuler la commande
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderStatusStepper;