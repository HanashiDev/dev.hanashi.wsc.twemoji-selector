define(['./Util', './Data'], function(TwemojiUtil, TwemojiData) {
    "use strict";

    function TwemojiParser(options = {}) {
        this.init(options);
    }
    TwemojiParser.prototype = {
        init: function(options) {
            // options
            this._emojiDataPath = WCF_PATH + 'js/Hanashi/Twemoji/twemoji.json';
            this._selector = null;
            this._emojiSize = 24;

            this._initOptions(options);
            if (this._selector === null) {
                console.log('no selector configured');
            }

            var data = TwemojiData.getTwemojiData();
            this._emojis = null;
            if (data.emo !== undefined && data.emo !== null) {
                this._emojis = data.emo;
            }
            this.parse();
        },

        _initOptions: function(options) {
            if (options.selector !== undefined && options.selector !== null) {
                this._selector = options.selector;
            }
            if (options.dataPath !== undefined && options.dataPath !== null) {
                this._emojiDataPath = options.dataPath;
            }
            if (options.size !== undefined && options.size !== null) {
                this._emojiSize = options.size;
            }
        },

        parse: function(selector = null) {
            if (this._emojis === undefined || this._emojis === null) return;

            if (selector === null) {
                selector = this._selector;
            }

            var nodeList = elBySelAll(selector);
            for (var emoji in this._emojis) {
                if (this._emojis[emoji] === undefined ||this._emojis[emoji] === null) continue;
                
                var native = TwemojiUtil.getEmojiByUnifier(this._emojis[emoji].u);
                if (!native) continue;

                var coordinates = this._emojis[emoji].c;
                var x = coordinates[0] * (this._emojiSize * -1);
                var y = coordinates[1] * (this._emojiSize * -1);
                var icon = '<span class="haTwemojiIcon' + this._emojiSize + '" style="background-position: ' + x + 'px ' + y + 'px"></span>';

                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].innerHTML.includes(native) > 0) {
                        nodeList[i].innerHTML = nodeList[i].innerHTML.replace(native, icon);
                    }
                }
            }
        }
    }

    return TwemojiParser;
});
