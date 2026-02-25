import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputField = ({
    label,
    name,
    value,
    onChange,
    error,
    hint,
    required = false,
    disabled = false,
    placeholder = "Entrez votre numéro",
    defaultCountry = 'ci',
    onlyCountries = ['ci', 'bj', 'sn', 'tg', 'bf'],
    preferredCountries = ['ci', 'bj'],
    enableSearch = true,
    searchPlaceholder = "Rechercher un pays...",
    className = '',
    ...props
}) => {

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`}>
            {/* Label */}
            {label && (
                <label className="text-xs font-semibold font-poppins text-neutral-8">
                    {label} {required && <span className="text-danger-1">*</span>}
                </label>
            )}

            {/* PhoneInput avec classe d'erreur conditionnelle */}
            <div className={error ? 'phone-input-error' : ''}>
                <PhoneInput
                    country={defaultCountry}
                    onlyCountries={onlyCountries}
                    value={value.replace('+', '')}
                    onChange={onChange}
                    placeholder={placeholder}
                    enableSearch={enableSearch}
                    searchPlaceholder={searchPlaceholder}
                    preferredCountries={preferredCountries}
                    disabled={disabled}
                    localization={{
                        ci: 'Côte d\'Ivoire',
                        bj: 'Bénin',
                        sn: 'Sénégal',
                        tg: 'Togo',
                        bf: 'Burkina Faso'
                    }}
                    inputProps={{
                        name: name,
                        required: required,
                        disabled: disabled,
                        ...props
                    }}
                />
            </div>

            {/* Hint ou Error */}
            {hint && !error && <p className="text-xs text-neutral-6 font-poppins">{hint}</p>}
            {error && <p className="text-xs text-danger-1 font-poppins">{error}</p>}
        </div>
    );
};

export default PhoneInputField;