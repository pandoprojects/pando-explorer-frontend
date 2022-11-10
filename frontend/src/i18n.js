import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEnglish from "./locales/en.json";
import translationHindi from "./locales/Hi.json";
import translationChinese from "./locales/Chinese.json";
import translationINDO from "./locales/indo.json";
import translationJapanese from "./locales/Japanese.json";
import translationKorean from "./locales/korean.json";
import translationMalay from "./locales/malay.json";
import translationPortuguese from "./locales/Portuguese.json";
import translationTHA from "./locales/tha.json";
import translationVietnamese from "./locales/Vietnamese.json";
import translationNepalese from "./locales/Nepalese.json";


//Creating object with the variables of imported translation files
const resources = {
    en: {
        translation: translationEnglish,
    },
    Hi: {
        translation: translationHindi,
    },
    Chinese: {
        translation: translationChinese,
    },
    indo: {
        translation: translationINDO,
    },
    Japanese: {
        translation: translationJapanese,
    },
    korean: {
        translation: translationKorean,
    },
    malay: {
        translation: translationMalay,
    },
    Portuguese: {
        translation: translationPortuguese,
    },
    tha: {
        translation: translationTHA,
    },
    Vietnamese: {
        translation: translationVietnamese,
    },
    Nepalese: {
        translation: translationNepalese
    }

};

//i18N Initialization

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;