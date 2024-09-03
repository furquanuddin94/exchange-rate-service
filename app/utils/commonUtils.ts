import { constants } from './envUtils';

export const kebabToCamel = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export const getCommonHeaders = () => {
    let commonHeaders = {};
    if (constants.protectionBypass) {
        commonHeaders = { 'x-vercel-protection-bypass': constants.protectionBypass };
        console.log("Protection bypass enabled");
    } else {
        console.log("Protection bypass disabled");
    }

    return commonHeaders;
}