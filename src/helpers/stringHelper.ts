export function checkIfContainText(lookingText: string, sourceText: string): boolean {
    sourceText = sourceText.toLowerCase();
    lookingText = lookingText.toLocaleLowerCase();

    if(sourceText.includes(lookingText)) return true;
    return false;
}