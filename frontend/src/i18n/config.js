import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ar from './translations/ar.json';
import en from './translations/en.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import de from './translations/de.json';
import it from './translations/it.json';
import pt from './translations/pt.json';
import ru from './translations/ru.json';
import zh from './translations/zh.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import hi from './translations/hi.json';
import bn from './translations/bn.json';
import ur from './translations/ur.json';
import tr from './translations/tr.json';
import fa from './translations/fa.json';
import id from './translations/id.json';
import ms from './translations/ms.json';
import sw from './translations/sw.json';
import nl from './translations/nl.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },
  bn: { translation: bn },
  ur: { translation: ur },
  tr: { translation: tr },
  fa: { translation: fa },
  id: { translation: id },
  ms: { translation: ms },
  sw: { translation: sw },
  nl: { translation: nl }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
