"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSCompletionItemProvider = void 0;
const vscode_1 = require("vscode");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const util_1 = require("../util");
const cache_1 = require("../cache");
class CSSCompletionItemProvider {
    constructor() {
        this._CSSLanguageService = (0, vscode_css_languageservice_1.getCSSLanguageService)();
        this._expression = /(styled\([\s\S]+\)`)([\s\S]*)`/gi;
        this._cache = new cache_1.CompletionsCache();
    }
    provideCompletionItems(document, position, _token) {
        const cached = this._cache.getCached(document, position);
        if (cached) {
            return cached;
        }
        const currentLine = document.lineAt(position.line);
        const empty = {
            isIncomplete: false,
            items: [],
        };
        if (currentLine.isEmptyOrWhitespace) {
            return empty;
        }
        const currentOffset = document.offsetAt(position);
        const documentText = document.getText();
        const match = (0, util_1.MatchOffset)(this._expression, documentText, currentOffset);
        if (!match) {
            return empty;
        }
        const dialect = undefined;
        // tslint:disable-next-line:no-magic-numbers
        const matchContent = match[2];
        const matchStartOffset = match.index + match[1].length;
        const virtualOffset = currentOffset - matchStartOffset;
        const virtualDocument = (0, util_1.CreateVirtualDocument)(dialect, matchContent);
        const vCss = this._CSSLanguageService.parseStylesheet(virtualDocument);
        const completions = this._CSSLanguageService.doComplete(virtualDocument, virtualDocument.positionAt(virtualOffset), vCss);
        const items = completions.items.map((item) => {
            return Object.assign(Object.assign({}, item), { documentation: typeof item.documentation === "object" &&
                    "value" in item.documentation
                    ? new vscode_1.MarkdownString(item.documentation.value) // item.documentation.value
                    : item.documentation, textEdit: null, insertText: item.insertText || item.label, range: typeof item.textEdit === "object" && "range" in item.textEdit
                    ? (0, util_1.cssRangeToVSCodeRange)(currentLine, item.textEdit.range)
                    : undefined, additionalTextEdits: [] });
        });
        this._cache.updateCached(document, position, Object.assign(Object.assign({}, completions), { items }));
        return {
            isIncomplete: completions.isIncomplete,
            items,
        };
    }
    resolveCompletionItem(item, _token) {
        return item;
    }
}
exports.CSSCompletionItemProvider = CSSCompletionItemProvider;
//# sourceMappingURL=css.js.map