"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const css_1 = require("./providers/css");
const hover_1 = require("./providers/hover");
const selector = ["typescriptreact", "javascriptreact"];
const triggers = [
    "!",
    ".",
    "}",
    ":",
    "*",
    "$",
    "]",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
];
function activate() {
    vscode_1.languages.registerHoverProvider(selector, new hover_1.CSSHoverProvider());
    vscode_1.languages.registerCompletionItemProvider(selector, new css_1.CSSCompletionItemProvider(), ...triggers);
}
exports.activate = activate;
//# sourceMappingURL=main.js.map