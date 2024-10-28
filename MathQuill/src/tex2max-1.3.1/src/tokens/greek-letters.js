/**
 * @author     André Storhaug <andr3.storhaug@gmail.com>
 * @copyright  2018 NTNU
 */

import * as logger from "../logger";

export const letters = [
    {
        name: 'alpha',
        symbol: 'α'
    }, {
        name: 'beta',
        symbol: 'β'
    }, {
        name: 'gamma',
        symbol: 'γ'
    }, {
        name: 'delta',
        symbol: 'δ'
    }, {
        name: 'epsilon',
        symbol: 'ϵ'
    }, {
        name: 'zeta',
        symbol: 'ζ'
    }, {
        name: 'eta',
        symbol: 'η'
    }, {
        name: 'theta',
        symbol: 'θ'
    }, {
        name: 'iota',
        symbol: 'ι'
    }, {
        name: 'kappa',
        symbol: 'κ'
    }, {
        name: 'lambda',
        symbol: 'λ'
    }, {
        name: 'mu',
        symbol: 'μ'
    }, {
        name: 'nu',
        symbol: 'ν'
    }, {
        name: 'omicron',
        symbol: 'ο'
    }, {
        name: 'pi',
        symbol: 'π'
    }, {
        name: 'rho',
        symbol: 'ρ'
    }, {
        name: 'sigma',
        symbol: 'σ'
    }, {
        name: 'tau',
        symbol: 'τ'
    }, {
        name: 'upsilon',
        symbol: 'υ'
    }, {
        name: 'phi',
        symbol: 'ϕ'
    }, {
        name: 'chi',
        symbol: 'χ'
    }, {
        name: 'psi',
        symbol: 'ψ'
    }, {
        name: 'omega',
        symbol: 'ω'
    }
];

export function toUpperCase(x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
}

export function isUpperCase(x) {
    return x.charAt(0).toUpperCase() === x.charAt(0);
}

export function getSymbol(name) {
    let symbol = letters.find((e) => e.name === name.toLowerCase());
    if (symbol === undefined) return null;
    symbol = symbol.symbol;
    if (isUpperCase(name)) symbol = toUpperCase(symbol);
    return symbol;
}

export function getName(symbol) {
    let name = letters.find((e) => e.symbol === symbol.toLowerCase());
    if (name === undefined) return null;
    name = name.name;
    if (isUpperCase(symbol)) name = toUpperCase(name);
    return name;
}

export function isGreekLetter(letter) {
    let symbol = letters.find((e) => e.name === letter.toLowerCase());
    let name = letters.find((e) => e.symbol === letter.toLowerCase());

    return symbol !== undefined || name !== undefined;
}

export function convertSymbols(math) {
    logger.debug('Converting math symbols ' + math);
    letters.forEach((letter) => {
        math = math.split(letter.symbol).join(letter.name);
        math = math.split(toUpperCase(letter.symbol))
            .join(toUpperCase(letter.name))
    });
    logger.debug('- Converted math symbols ' + math);
    return math;
}