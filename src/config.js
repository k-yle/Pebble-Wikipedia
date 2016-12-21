/*global module*/
module.exports = [{
    type: "section",
    items: [{
        type: "heading",
        defaultValue: "Wikipedia Settings"
    }, {
        type: "toggle",
        appKey: "cq",
        label: "Confirm query",
        defaultValue: 'en',
        attributes: {
            required: "required"
        }
    }, {
        type: "select",
        appKey: "CC",
        defaultValue: "en",
        label: "Language",
        options: [
            { value: "ar",  label: "العربي" },
            { value: "az",  label: "Azərbaycanca" },
            { value: "bg",  label: "Български" },
            { value: "nan", label: "Bân-lâm-gú / Hō-ló-oē" },
            { value: "be",  label: "Беларуская (Акадэмічная)" },
            { value: "ca",  label: "Català" },
            { value: "cs",  label: "Čeština" },
            { value: "da",  label: "Dansk" },
            { value: "de",  label: "Deutsch" },
            { value: "et",  label: "Eesti" },
            { value: "el",  label: "Ελληνικά" },
            { value: "en",  label: "English" },
            { value: "es",  label: "Español" },
            { value: "eo",  label: "Esperanto" },
            { value: "eu",  label: "Euskara" },
            { value: "fa",  label: "فارسی" },
            { value: "fr",  label: "Français" },
            { value: "gl",  label: "Galego" },
            { value: "ko",  label: "한국어" },
            { value: "hy",  label: "Հայերեն" },
            { value: "hi",  label: "हिन्दी" },
            { value: "hr",  label: "Hrvatski" },
            { value: "id",  label: "Bahasa Indonesia" },
            { value: "it",  label: "Italiano" },
            { value: "he",  label: "עברית" },
            { value: "ka",  label: "ქართული" },
            { value: "la",  label: "Latina" },
            { value: "lt",  label: "Lietuvių" },
            { value: "hu",  label: "Magyar" },
            { value: "ms",  label: "Bahasa Melayu" },
            { value: "min", label: "Bahaso Minangkabau" },
            { value: "nl",  label: "Nederlands" },
            { value: "ja",  label: "日本語" },
            { value: "nb",  label: "Norsk (Bokmål)" },
            { value: "nn",  label: "Norsk (Nynorsk)" },
            { value: "ce",  label: "Нохчийн" },
            { value: "uz",  label: "Oʻzbekcha / Ўзбекча" },
            { value: "pl",  label: "Polski" },
            { value: "pt",  label: "Português" },
            { value: "kk",  label: "Қазақша / Qazaqşa / قازاقشا" },
            { value: "ro",  label: "Română" },
            { value: "ru",  label: "Русский" },
            { value: "simple",  label: "Simple English" },
            { value: "ceb", label: "Sinugboanong Binisaya" },
            { value: "sk",  label: "Slovenčina" },
            { value: "sl",  label: "Slovenščina" },
            { value: "sr",  label: "Српски / Srpski" },
            { value: "sh",  label: "Srpskohrvatski / Српскохрватски" },
            { value: "fi",  label: "Suomi" },
            { value: "sv",  label: "Svenska" },
            { value: "th",  label: "ภาษาไทย" },
            { value: "tr",  label: "Türkçe" },
            { value: "uk",  label: "Українська" },
            { value: "ur",  label: "اردو" },
            { value: "vi",  label: "Tiếng Việt" },
            { value: "vo",  label: "Volapük" },
            { value: "war", label: "Winaray" },
            { value: "zh",  label: "中文" }
        ],
        attributes: {
            required: "required"
        }
    }, {
        type: "toggle",
        appKey: "LargeFontSize",
        label: "Large font size",
        defaultValue: false,
        attributes: {
            required: "required"
        }
    }, {
        type: "toggle",
        appKey: "units",
        label: "Metric Units",
        defaultValue: true,
        attributes: {
            required: "required"
        }
    }, {
        type: "toggle",
        appKey: "vibe",
        label: "Vibrate on success",
        defaultValue: true,
        attributes: {
            required: "required"
        }
    }]
}, {
    name: 'submit',
    type: "submit",
    defaultValue: "Save"
}];