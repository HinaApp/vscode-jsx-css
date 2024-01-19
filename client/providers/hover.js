"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSHoverProvider = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const util_1 = require("../util");
class CSSHoverProvider {
    constructor() {
        this._cssLanguageService = (0, vscode_css_languageservice_1.getCSSLanguageService)();
        this._expression = /(styled\([\s\S]+\)`)([\s\S]*)`/gi;
    }
    provideHover(document, position, token) {
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = (0, util_1.MatchOffset)(this._expression, documentText, currentOffset);
        if (!match) {
            return null;
        }
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const virtualOffset = currentOffset - matchStartOffset;
        const virtualDocument = (0, util_1.CreateVirtualDocument)(undefined, matchContent);
        const stylesheet = this._cssLanguageService.parseStylesheet(virtualDocument);
        const hover = this._cssLanguageService.doHover(virtualDocument, virtualDocument.positionAt(virtualOffset), stylesheet);
        if (typeof hover.contents === "string" ||
            Array.isArray(hover.contents) ||
            ("language" in hover && "value" in hover))
            return hover;
        return Object.assign(Object.assign({}, hover), { contents: [hover.contents.value] });
    }
}
exports.CSSHoverProvider = CSSHoverProvider;
//# sourceMappingURL=hover.js.map