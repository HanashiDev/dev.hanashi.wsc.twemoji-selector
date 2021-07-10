export class TwemojiUtil {
    public static getEmojiByUnifier(unifier: string) {
        let native: string = '';
        let unifiedSplitted = unifier.split('-');

        let unifiedInteger: number[] = [];
        for (let i = 0; i < unifiedSplitted.length; i++) {
            unifiedInteger.push(parseInt(unifiedSplitted[i], 16));
        }
        if (unifiedInteger.length == 1) {
            native = String.fromCodePoint(unifiedInteger[0]);
        } else if (unifiedInteger.length == 2) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1]);
        } else if (unifiedInteger.length == 3) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2]);
        } else if (unifiedInteger.length == 4) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2], unifiedInteger[3]);
        } else if (unifiedInteger.length == 5) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2], unifiedInteger[3], unifiedInteger[4]);
        } else if (unifiedInteger.length == 6) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2], unifiedInteger[3], unifiedInteger[4], unifiedInteger[5]);
        } else if (unifiedInteger.length == 7) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2], unifiedInteger[3], unifiedInteger[4], unifiedInteger[5], unifiedInteger[6]);
        } else if (unifiedInteger.length == 8) {
            native = String.fromCodePoint(unifiedInteger[0], unifiedInteger[1], unifiedInteger[2], unifiedInteger[3], unifiedInteger[4], unifiedInteger[5], unifiedInteger[6], unifiedInteger[7]);
        }
        return native;
    }
}

export default TwemojiUtil;
