"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVirtualDocument = exports.cssRangeToVSCodeRange = exports.GetRegionAtOffset = exports.Match = exports.MatchOffset = void 0;
const vscode_1 = require("vscode");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
// import { EmmetConfiguration } from 'vscode-emmet-helper'
// export function GetEmmetConfiguration(): EmmetConfiguration {
// 	const emmetConfig = workspace.getConfiguration('emmet')
// 	return {
// 		useNewEmmet: true,
// 		showExpandedAbbreviation: emmetConfig.showExpandedAbbreviation,
// 		showAbbreviationSuggestions: emmetConfig.showAbbreviationSuggestions,
// 		syntaxProfiles: emmetConfig.syntaxProfiles,
// 		variables: emmetConfig.variables
// 	} as EmmetConfiguration
// }
// export function NotNull<T>(input: any): T {
// 	if (!input) {
// 		return {} as T
// 	}
// 	return input as T
// }
function MatchOffset(regex, data, offset) {
    regex.exec(null);
    let match;
    while ((match = regex.exec(data)) !== null) {
        if (offset > match.index + match[1].length &&
            offset < match.index + match[0].length) {
            return match;
        }
    }
    return null;
}
exports.MatchOffset = MatchOffset;
function Match(regex, data) {
    regex.exec(null);
    let match;
    if ((match = regex.exec(data)) !== null) {
        return match;
    }
    return null;
}
exports.Match = Match;
// export function GetLanguageRegions(
// 	service: LanguageService,
// 	data: string
// ): IEmbeddedRegion[] {
// 	const scanner = service.createScanner(data)
// 	const regions: IEmbeddedRegion[] = []
// 	let tokenType: HTMLTokenType
// 	while ((tokenType = scanner.scan()) !== HTMLTokenType.EOS) {
// 		switch (tokenType) {
// 			case HTMLTokenType.Styles:
// 				regions.push({
// 					languageId: 'css',
// 					start: scanner.getTokenOffset(),
// 					end: scanner.getTokenEnd(),
// 					length: scanner.getTokenLength(),
// 					content: scanner.getTokenText()
// 				})
// 				break
// 			default:
// 				break
// 		}
// 	}
// 	return regions
// }
function GetRegionAtOffset(regions, offset) {
    for (let region of regions) {
        if (region.start <= offset) {
            if (offset <= region.end) {
                return region;
            }
        }
        else {
            break;
        }
    }
    return null;
}
exports.GetRegionAtOffset = GetRegionAtOffset;
// export function TranslateHTMLTextEdits(
//   input: HTMLTextEdit[],
//   offset: number
// ): TextEdit[] {
//   return input.map((item: HTMLTextEdit) => {
//     const startPosition = new Position(
//       item.range.start.line + offset,
//       item.range.start.character
//     );
//     const endPosition = new Position(
//       item.range.end.line + offset - 1,
//       item.range.end.character
//     );
//     const itemRange = new Range(startPosition, endPosition);
//     return new TextEdit(itemRange, item.newText);
//   });
// }
function cssRangeToVSCodeRange(line, range) {
    return new vscode_1.Range(new vscode_1.Position(line.lineNumber, range.start.character), new vscode_1.Position(line.lineNumber, range.end.character));
}
exports.cssRangeToVSCodeRange = cssRangeToVSCodeRange;
// export function TranslateCompletionItems(
//   items: CSSCompletionItem[],
//   line: TextLine,
//   expand: boolean = false
// ): CompletionItem[] {
//   return items.map((item: CSSCompletionItem) => {
//     const result = item as CompletionItem;
//     const range = new Range(
//       new Position(line.lineNumber, result.textEdit.range.start.character),
//       new Position(line.lineNumber, result.textEdit.range.end.character)
//     );
//     result.textEdit = null;
//     // @ts-ignore - setting range for intellisense to show results properly
//     result.range = range;
//     if (expand) {
//       // i use this to both expand html abbreviations and auto complete tags
//       result.command = {
//         title: "Emmet Expand Abbreviation",
//         command: "editor.emmet.action.expandAbbreviation",
//       } as Command;
//     }
//     return result;
//   });
// }
function CreateVirtualDocument(
// context: TextDocument | HTMLTextDocument,
languageId, 
// position: Position | HtmlPosition,
content) {
    return vscode_html_languageservice_1.TextDocument.create(`embedded://document.${languageId}`, languageId, 1, content);
}
exports.CreateVirtualDocument = CreateVirtualDocument;
//# sourceMappingURL=util.js.map