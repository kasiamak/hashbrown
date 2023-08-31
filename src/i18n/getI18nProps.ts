import { type GetStaticProps } from "next";
import { type Locales } from "~/i18n/i18n-types";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";
import { loadedLocales } from "~/i18n/i18n-util";

// You need to fetch the locale and pass it to the page props.
// Unfortunately this cannot be done in a global way.
// This needs to be done for each page you create.
// The best option is to create a custom function and use it in getStaticProps.
const getI18nProps: GetStaticProps = async (context) => {
  const locale = context.locale as Locales;
  await loadLocaleAsync(locale);

  return {
    props: {
      i18n: {
        locale: locale,
        dictionary: loadedLocales[locale],
      },
    },
  };
};

export default getI18nProps;