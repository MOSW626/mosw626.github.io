import { createContext, useContext } from 'react';

export const LanguageContext = createContext({ lang: 'ko', setLang: () => {} });
export const useLang = () => useContext(LanguageContext);

/**
 * 객체에서 언어에 맞는 필드를 고른다.
 * en이고 `${key}En` 필드가 있으면 그것을, 없으면 base(key) 값을 반환.
 */
export function pick(obj, key, lang) {
  if (lang === 'en') {
    const en = obj[`${key}En`];
    if (en !== undefined && en !== null && en !== '') return en;
  }
  return obj[key];
}

/** 짧은 ko/en 리터럴 선택용 헬퍼 */
export const t = (lang, ko, en) => (lang === 'en' ? en : ko);
