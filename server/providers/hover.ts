import {
  HoverProvider,
  TextDocument,
  Position,
  CancellationToken,
  Hover,
} from "vscode";

import {
  getCSSLanguageService as GetCssLanguageService,
  LanguageService as CssLanguageService,
} from "vscode-css-languageservice";

import { CreateVirtualDocument, MatchOffset } from "../util";

export class CSSHoverProvider implements HoverProvider {
  private _cssLanguageService: CssLanguageService = GetCssLanguageService();
  private _expression = /(styled\([\s\S]+\)`)([\s\S]*)`/gi;

  provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Hover {
    const currentOffset = document.offsetAt(position);
    const documentText = document.getText();
    const match = MatchOffset(this._expression, documentText, currentOffset);

    if (!match) {
      return null;
    }

    // tslint:disable-next-line:no-magic-numbers
    const matchContent: string = match[2];
    const matchStartOffset = match.index + match[1].length;
    const virtualOffset = currentOffset - matchStartOffset;
    const virtualDocument = CreateVirtualDocument(undefined, matchContent);
    const stylesheet =
      this._cssLanguageService.parseStylesheet(virtualDocument);
    const hover = this._cssLanguageService.doHover(
      virtualDocument,
      virtualDocument.positionAt(virtualOffset),
      stylesheet
    );
    if (
      typeof hover.contents === "string" ||
      Array.isArray(hover.contents) ||
      ("language" in hover && "value" in hover)
    )
      return hover as Hover;

    return { ...(hover as Hover), contents: [hover.contents.value] };
  }
}
