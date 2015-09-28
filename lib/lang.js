'use strict';

let lang = {};

// los templates se cargan en app.js
lang.templates = [
    /*{
        langid: 'en',
        strings: {
            'the_field': 'the field',
            ...
        }
    }
    ,
    {
        langid: 'es',
        strings: {
            'the_field': 'el campo',
            ...
        }
    }*/
];

lang.registerLang = (langid)=> {
    let strings = require('../lang/' + langid);
    lang.templates.push({
        langid: langid,
        strings: strings
    });
};

lang.getTemplate = (langid)=> {
    for (let i = 0; i < lang.templates.length; i++) {
        let tpl = lang.templates[i];
        if (tpl.langid === langid) {
            return tpl;
        }
    }

    return lang.templates[0];
};

lang.translate = (key, langid, values)=> {

    let str = key;
    let strings = lang.getTemplate(langid).strings;

    if (strings.hasOwnProperty(key)) {
        str = strings[key];
    }

    // si tiene valores custom los reemplazo
    if (values) {
        Object.getOwnPropertyNames(values).forEach((value)=> {
            str = str.replace(`$$${value}$$`, values[value]);
        });
    }

    return str;
};

module.exports = lang;
