define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwemojiUtil = void 0;
    class TwemojiUtil {
        static getEmojiByUnifier(unifier) {
            return String.fromCodePoint(...unifier.split("-").map((u) => parseInt(u, 16)));
        }
    }
    exports.TwemojiUtil = TwemojiUtil;
    exports.default = TwemojiUtil;
});
