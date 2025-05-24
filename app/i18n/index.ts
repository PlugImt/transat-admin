import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import esTranslation from './locales/es.json';
import ptTranslation from './locales/pt.json';
import ptBRTranslation from './locales/pt-BR.json';
import deTranslation from './locales/de.json';
import zhTranslation from './locales/zh.json';

// Initialize i18next
i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            fr: {
                translation: frTranslation
            },
            es: {
                translation: esTranslation
            },
            pt: {
                translation: ptTranslation
            },
            'pt-BR': {
                translation: ptBRTranslation
            },
            de: {
                translation: deTranslation
            },
            zh: {
                translation: zhTranslation
            }
        },
        fallbackLng: 'en',
        debug: false,

        // Common namespace used around the full app
        ns: ['translation'],
        defaultNS: 'translation',

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        detection: {
            order: ['navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,
            // Map common language codes to our supported languages
            convertDetectedLanguage: (lng: string) => {
                // Handle Brazilian Portuguese specifically
                if (lng.startsWith('pt-BR') || lng === 'pt-br') return 'pt-BR';
                if (lng.startsWith('pt')) return 'pt';
                
                // Handle Chinese variants
                if (lng.startsWith('zh')) return 'zh';
                
                // Handle other languages
                const supportedLanguages = ['en', 'fr', 'es', 'pt', 'pt-BR', 'de', 'zh'];
                const baseLang = lng.split('-')[0];
                
                if (supportedLanguages.includes(lng)) return lng;
                if (supportedLanguages.includes(baseLang)) return baseLang;
                
                return 'en'; // fallback
            }
        }
    });

export default i18n; 