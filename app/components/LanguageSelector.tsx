import {useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function LanguageSelector() {
    const {i18n} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = i18n.language.substring(0, 2);

    const languages = [
        {code: 'en', name: 'English', flag: '🇬🇧'},
        {code: 'fr', name: 'Français', flag: '🇫🇷'}
    ];

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md border border-accent-hover hover:bg-card-bg transition-colors duration-300"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-lg mr-1">{currentLanguageInfo.flag}</span>
                <span className="text-sm">{currentLanguageInfo.name}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-card-bg border border-accent-hover z-50">
                    <div className="py-1">
                        {languages.map(language => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`block w-full text-left px-4 py-2 hover:bg-accent hover:text-white transition-colors duration-300 ${
                                    currentLanguage === language.code ? 'bg-accent bg-opacity-20' : ''
                                }`}
                            >
                                <div className="flex items-center">
                                    <span className="text-lg mr-2">{language.flag}</span>
                                    <span>{language.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 