"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfContainText = void 0;
function checkIfContainText(lookingText, sourceText) {
    sourceText = sourceText.toLowerCase();
    lookingText = lookingText.toLocaleLowerCase();
    if (sourceText.includes(lookingText))
        return true;
    return false;
}
exports.checkIfContainText = checkIfContainText;
