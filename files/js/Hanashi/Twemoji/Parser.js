define(['./Util'], function(TwemojiUtil) {
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

            fetch(this._emojiDataPath).then(this._dataResponse.bind(this));
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

        _dataResponse: function(response) {
            response.json().then(this._dataFetched.bind(this));
        },

        _dataFetched: function(data) {
            var nodeList = elBySelAll(this._selector);

            if (data.emo !== undefined && data.emo !== null) {
                var emojis = data.emo;
                for (var emoji in emojis) {
                    if (emojis[emoji] === undefined || emojis[emoji] === null) continue;
                    
                    var native = TwemojiUtil.getEmojiByUnifier(emojis[emoji].u);
                    if (!native) continue;

                    var coordinates = emojis[emoji].c;
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
    }

    return TwemojiParser;
});
