import {
  CompletionList,
  CompletionItem,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItemProvider,
  MarkdownString,
} from "vscode";

import { CompletionItem as CSSCompletionItem } from "vscode-css-languageservice";

import {
  getCSSLanguageService as GetCSSLanguageService,
  LanguageService as CSSLanguageService,
} from "vscode-css-languageservice";

import {
  MatchOffset,
  CreateVirtualDocument,
  cssRangeToVSCodeRange,
} from "../util";

import { CompletionsCache } from "../cache";

export class CSSCompletionItemProvider implements CompletionItemProvider {
  private _CSSLanguageService: CSSLanguageService = GetCSSLanguageService();
  private _expression = /(styled\([\s\S]+\)`)([\s\S]*)`/gi;
  private _cache = new CompletionsCache();

  public provideCompletionItems(
    document: TextDocument,
    position: Position,
    _token: CancellationToken
  ): CompletionList {
    const cached = this._cache.getCached(document, position);

    if (cached) {
      return cached;
    }

    const currentLine = document.lineAt(position.line);
    const empty = {
      isIncomplete: false,
      items: [],
    } as CompletionList;

    if (currentLine.isEmptyOrWhitespace) {
      return empty;
    }

    const currentOffset = document.offsetAt(position);
    const documentText = document.getText();
    const match = MatchOffset(this._expression, documentText, currentOffset);

    if (!match) {
      return empty;
    }

    const dialect = undefined;

    // tslint:disable-next-line:no-magic-numbers
    const matchContent: string = match[2];
    const matchStartOffset = match.index + match[1].length;
    const virtualOffset = currentOffset - matchStartOffset;
    const virtualDocument = CreateVirtualDocument(dialect, matchContent);
    const vCss = this._CSSLanguageService.parseStylesheet(virtualDocument);

    const completions = this._CSSLanguageService.doComplete(
      virtualDocument,
      virtualDocument.positionAt(virtualOffset),
      vCss
    );

    const items: CompletionItem[] = completions.items.map(
      (item: CSSCompletionItem) => {
        return {
          ...item,
          documentation:
            typeof item.documentation === "object" &&
            "value" in item.documentation
              ? new MarkdownString(item.documentation.value)
              : item.documentation,
          textEdit: null,
          insertText: item.insertText || item.label,
          range:
            typeof item.textEdit === "object" && "range" in item.textEdit
              ? cssRangeToVSCodeRange(currentLine, item.textEdit.range)
              : undefined,
          additionalTextEdits: [],
        };
      }
    );
    this._cache.updateCached(document, position, {
      ...completions,
      items,
    });

    return {
      isIncomplete: completions.isIncomplete,
      items,
    };
  }

  public resolveCompletionItem?(
    item: CompletionItem,
    _token: CancellationToken
  ): CompletionItem | Thenable<CompletionItem> {
    return item;
  }
}
