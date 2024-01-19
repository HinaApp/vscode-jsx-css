import { languages as Languages, DocumentSelector } from "vscode";
import { CSSCompletionItemProvider } from "./providers/css";
import { CSSHoverProvider } from "./providers/hover";

const selector: DocumentSelector = ["typescriptreact", "javascriptreact"];
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

export function activate() {
  Languages.registerHoverProvider(selector, new CSSHoverProvider());
  Languages.registerCompletionItemProvider(
    selector,
    new CSSCompletionItemProvider(),
    ...triggers
  );
}
