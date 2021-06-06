import {useTranslation} from "react-i18next";

export default function () {
    const {t: trans, i18n} = useTranslation();
    return {
        trans,
        i18n
    }
}