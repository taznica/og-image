
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const notoBold = readFileSync(`${__dirname}/../_fonts/NotoSansJP-Bold-Subset.woff2`).toString("base64");
const icon = readFileSync(`${__dirname}/../../public/icon.png`).toString('base64');

function getCss(fontSize: string) {
    let background = 'white';
    let foreground = 'black';

    return `
    @font-face {
        font-family: 'Noto Sans JP';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${notoBold}) format('woff2');
    }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
    
    .border {
        width: calc(1200px + 6px);
        height: calc(630px + 6px);
        border-bottom: 20px solid rgba(184, 156, 94, 1);
        box-sizing: border-box;
    }
    
    .wrapper {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 60px;
        margin-right: 60px;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: bold;
        color: ${foreground};
        line-height: 1.8;
        margin-top: 70px;
    }
    
    .footer {
        width: 100%;
        font-family: 'Noto Sans JP', 'Inter', sans-serif;
        font-size: 36px;
        font-style: normal;
        font-weight: bold;
        color: ${foreground};
        line-height: 1.0;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    
    img {
        height: 48px;
        margin-right: 8px;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, md, fontSize } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(fontSize)}
    </style>
    <body>
        <div class="border">
            <div class="wrapper">
                <div class="heading">${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                )}
                </div>
                <div class="footer">
                    <img src="data:image/png;base64,${icon}">
                    <p>taznica.com</p>
                </div>
            </div>
        </div>
    </body>
</html>`;
}
