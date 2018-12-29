const fetch = require('node-fetch');
const cheerio = require('cheerio');

const devices = [
    {type: "desktop", text: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36"},
    {type: "mobile", text: "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Mobile Safari/537.36"}
];

const randomNumber = Math.round(Math.random() * 1);
const randomDevice = devices[randomNumber];

const url = 'https://tn.com.ar?'+Date.now();

fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': randomDevice.text
        },
    })
    .then(res => res.text())
    .then(body => {
        console.log("Se hizo el request a", url, "con el device:", randomDevice.text);

        const $ = cheerio.load(body);

        const headerClasses = $('header').attr('class');
        const footerClasses = $('footer').attr('class');
        const linkedCss = $('link[type="text/css"]').toArray().map(tag => tag.attribs.href);

        const consoleColorEval = (bool) => bool ? "\x1b[32m" : "\"\x1b[31m\"";

        const headerIsOk = () => headerClasses.indexOf(randomDevice.type) > -1;
        const footerIsOk = () => footerClasses.indexOf(randomDevice.type) > -1;
        const cssIsOk = () => !!linkedCss.filter(css => css.indexOf(randomDevice.type) > -1);

        console.log(consoleColorEval(headerIsOk), "El tag <header> resultante tiene las clases", headerClasses);
        console.log(consoleColorEval(footerIsOk), "El tag <footer> resultante tiene las clases", footerClasses);
        console.log(consoleColorEval(cssIsOk), "Coincide con el esperado", "Los tag <link> de css apuntan a", linkedCss);

    })
    .catch((err) => console.error(err));
