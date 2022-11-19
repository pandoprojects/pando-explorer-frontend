import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEnglish from "./locales/English.json";
import translationHindi from "./locales/Hindi.json";
import translationChinese from "./locales/Mandarin.json";
import translationINDO from "./locales/Indonesia.json";
import translationJapanese from "./locales/Japanese.json";
import translationKorean from "./locales/korean.json";
import translationMalay from "./locales/Melayu.json";
import translationPortuguese from "./locales/Portuguese.json";
import translationTHA from "./locales/Thai.json";
import translationVietnamese from "./locales/Vietnamese.json";
import translationNepalese from "./locales/Nepalese.json";


//Creating object with the variables of imported translation files
const resources = {
    English: {
        translation: translationEnglish,
    },
    Hindi: {
        translation: translationHindi,
    },
    Mandarin: {
        translation: translationChinese,
    },
    Indonesia: {
        translation: translationINDO,
    },
    Japanese: {
        translation: translationJapanese,
    },
    Korean: {
        translation: translationKorean,
    },
    Melayu: {
        translation: translationMalay,
    },
    Portuguese: {
        translation: translationPortuguese,
    },
    Thai: {
        translation: translationTHA,
    },
    Vietnamese: {
        translation: translationVietnamese,
    },
    Nepalese: {
        translation: translationNepalese
    }
};



i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "English", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;