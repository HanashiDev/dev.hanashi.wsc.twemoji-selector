define(["require", "exports", "tslib", "./Data", "./Util"], function (require, exports, tslib_1, Data_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwemojiParser = void 0;
    Data_1 = tslib_1.__importDefault(Data_1);
    Util_1 = tslib_1.__importDefault(Util_1);
    class TwemojiParser {
        emojiDataPath = window.WCF_PATH + "js/Hanashi/Twemoji/twemoji.json";
        emojiSize = 24;
        selector = undefined;
        emojis;
        constructor(options = {}) {
            if (options.selector != null) {
                this.selector = options.selector;
            }
            if (options.dataPath != null) {
                this.emojiDataPath = options.dataPath;
            }
            if (options.size != null) {
                this.emojiSize = options.size;
            }
            if (this.selector == null) {
                console.error("no selector configured");
            }
            const twemojiData = Data_1.default.getTwemojiData();
            if (twemojiData.emo != null) {
                this.emojis = twemojiData.emo;
            }
            this.parse();
        }
        parse(selector = undefined) {
            if (this.emojis == null) {
                return;
            }
            if (selector == null) {
                selector = this.selector;
            }
            if (selector == null) {
                console.error("no selector configured");
                return;
            }
            const nodeList = document.querySelectorAll(selector);
            for (const [, emoji] of Object.entries(this.emojis)) {
                const native = Util_1.default.getEmojiByUnifier(emoji.u);
                if (!native) {
                    continue;
                }
                const x = emoji.c[0] * (this.emojiSize * -1);
                const y = emoji.c[1] * (this.emojiSize * -1);
                const icon = `<span class="haTwemojiIcon${this.emojiSize}" style="background-position: ${x}px ${y}px"></span>`;
                nodeList.forEach((node) => {
                    if (!node.innerHTML.includes(native)) {
                        return;
                    }
                    node.innerHTML = node.innerHTML.replace(new RegExp(native, "g"), icon);
                });
            }
        }
    }
    exports.TwemojiParser = TwemojiParser;
    exports.default = TwemojiParser;
});
