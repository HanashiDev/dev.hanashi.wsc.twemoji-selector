define(['./Util', 'Language'], function(TwemojiUtil, Language) {
    "use strict";

    function TwemojiSelector(options = {}) {
        this.init(options);
    }
    TwemojiSelector.prototype = {
        init: function(options) {
            // cache variables
            this._emojiCategories = [];
            this._emojis = {};
            this._firstEmoji = null;
            this._navButtons = {};
            this._emojiSections = {};
            this._isSearching = false;
            this._emojiSectionDiv = null;
            this._emojiSectionSearchDiv = null;

            // preview variables
            this._twemojiPreview = null;
            this._twemojiTitlePreview = null;
            this._twemojiAliasPreview = null;

            // options
            this._selector = 'twemoji-selector';
            this._emojiDataPath = WCF_PATH + 'js/Hanashi/Twemoji/twemoji.json';
            this._theme = 'light';
            this._callback = null;

            // initialize options
            this._initOptions(options);

            // start fetch twemoji data
            fetch(this._emojiDataPath).then(this._dataResponse.bind(this));
        },

        _initOptions: function(options) {
            if (options.selector !== undefined && options.selector !== null) {
                this._selector = options.selector;
            }
            if (options.dataPath !== undefined && options.dataPath !== null) {
                this._emojiDataPath = options.dataPath;
            }
            if (options.theme !== undefined && options.theme !== null) {
                this._theme = options.theme;
            }
            if (options.callback !== undefined && options.callback !== null) {
                this._callback = options.callback;
            }
        },

        _scrollEmojiList: function(e) {
            if (this._isSearching) return;

            for (var key in this._emojiSections) {
                var section = this._emojiSections[key];
                var rect = section.getBoundingClientRect();
                var targetRect = e.target.getBoundingClientRect();
                var isVisible = rect.y <= targetRect.top && rect.y > (targetRect.top - rect.height);
                
                if (isVisible) {
                    this._navButtons[key].classList.add('active');
                } else {
                    this._navButtons[key].classList.remove('active');
                }
            }
        },

        _dataResponse: function(response) {
            response.json().then(this._dataFetched.bind(this));
        },

        _dataFetched: function(data) {
            if (data.cat !== undefined && data.cat !== null) {
                this._emojiCategories = data.cat;
            }
            if (data.emo !== undefined && data.emo !== null) {
                this._emojis = data.emo;
            }

            this._generateSelectorViews();
        },

        _generateSelectorViews: function() {
            elBySelAll(this._selector).forEach(this._generateSelectorView.bind(this));
        },

        _generateSelectorView: function(element) {
            var wrapper = this._createWrapper();
            wrapper.appendChild(this._createNav());
            wrapper.appendChild(this._createSearch());
            wrapper.appendChild(this._createEmojiSections());
            wrapper.appendChild(this._createPreviewSection());

            element.append(wrapper);
        },

        _hoverTwemoji: function(e) {
            if (this._twemojiPreview === null || this._twemojiTitlePreview === null || this._twemojiAliasPreview === null) return;

            var target = e.target;
            var button = elClosest(target, 'button');
            if (button === undefined || button === null) return;

            var emojiName = elData(button, 'emoji-name');
            if (emojiName === undefined || emojiName === null) return;

            if (this._emojis[emojiName] === undefined || this._emojis[emojiName] === null) return;

            var coordinates = this._emojis[emojiName].c;
            var x = coordinates[0] * -24;
            var y = coordinates[1] * -24;
            this._twemojiPreview.style.backgroundPosition = x + 'px ' + y + 'px';

            this._twemojiTitlePreview.innerText = this._emojis[emojiName].n;
            this._twemojiAliasPreview.innerText = ':' + emojiName + ':';
        },

        _clickTwemoji: function(e) {
            e.preventDefault();

            var target = e.target;
            var button = elClosest(target, 'button');
            if (button === undefined || button === null) return;

            var emojiName = elData(button, 'emoji-name');
            if (emojiName === undefined || emojiName === null) return;

            if (this._emojis[emojiName] === undefined || this._emojis[emojiName] === null) return;

            var emoji = this._emojis[emojiName];

            var native = TwemojiUtil.getEmojiByUnifier(emoji.u);

            var returnData = {
                id: emojiName,
                colons: ':' + emojiName + ':',
                name: emoji.n,
                coordinates: emoji.c,
                unified: emoji.u,
                native: native
            };
            if (emoji.a !== undefined && emoji.a !== null) {
                returnData['alias'] = emoji.a;
            }

            if (this._callback !== null && typeof this._callback === 'function') {
                this._callback(returnData);
            } else {
                console.log('no callback specified');
            }
        },

        _clickNavButton: function(e) {
            e.preventDefault();

            if (this._isSearching) return;

            var target = e.target;
            var button = elClosest(target, 'button');
            if (button === undefined || button === null) return;

            var categoryID = elData(button, 'category-id');
            if (categoryID === undefined || categoryID === null) return;

            if (this._emojiSections[categoryID] === undefined || this._emojiSections[categoryID] === null) return;

            this._emojiSections[categoryID].scrollIntoView(true);
        },

        _changeSearchValue: function(e) {
            var target = e.target;
            if (target.value) {
                this._isSearching = true;
                this._generateSearchResult(target.value);
            } else {
                this._isSearching = false;
                if (this._emojiSectionSearchDiv !== null) {
                    elRemove(this._emojiSectionSearchDiv);
                }
                this._emojiSectionSearchDiv = null;
                elShow(this._emojiSectionDiv);
            }
        },

        _generateSearchResult: function(value) {
            value = value.toLowerCase();

            if (this._emojiSectionSearchDiv !== null) {
                elRemove(this._emojiSectionSearchDiv);
            }

            this._emojiSectionSearchDiv = elCreate('div');
            this._emojiSectionSearchDiv.classList.add('emojiSection');

            var emojiSection = elCreate('section');

            // create section Title
            var sectionTitleDiv = elCreate('div');
            sectionTitleDiv.classList.add('sectionTitle');

            var sectionTitleSpan = elCreate('span');
            sectionTitleSpan.innerText = 'Search result: ' + value;
            sectionTitleDiv.appendChild(sectionTitleSpan);

            emojiSection.appendChild(sectionTitleDiv);

            // create emoji list
            var emojiList = elCreate('ul');
            emojiList.classList.add('emojiList');

            for (var emoji in this._emojis) {
                if (emoji.includes(value) || this._emojis[emoji].n.toLowerCase().includes(value)) {
                    var emojiItem = elCreate('li');

                    var emojiButton = elCreate('button');
                    elData(emojiButton, 'emoji-name', emoji);

                    var emojiSpan = elCreate('span');
                    var coordinates = this._emojis[emoji].c;
                    var x = coordinates[0] * -24;
                    var y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = x + 'px ' + y + 'px';

                    emojiButton.addEventListener('mouseover', this._hoverTwemoji.bind(this));
                    emojiButton.addEventListener(WCF_CLICK_EVENT, this._clickTwemoji.bind(this));

                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);

                    emojiList.appendChild(emojiItem);
                }
            }

            emojiSection.appendChild(emojiList);

            this._emojiSectionSearchDiv.append(emojiSection);
            elHide(this._emojiSectionDiv);
            this._emojiSectionDiv.parentNode.insertBefore(this._emojiSectionSearchDiv, this._emojiSectionDiv.nextSibling);
        },

        // generate functions
        _createWrapper: function() {
            var wrapper = elCreate('div');
            wrapper.classList.add('twemojiSelector');
            if (this._theme == 'dark') {
                wrapper.classList.add('dark');
            } else if (this._theme == 'light') {
                wrapper.classList.add('light');
            }
            return wrapper;
        },

        _createNav: function() {
            var navSection = elCreate('div');
            navSection.classList.add('navSection');

            var nav = elCreate('nav');

            for (var i = 0; i < this._emojiCategories.length; i++) {
                this._navButtons[this._emojiCategories[i].icon] = elCreate('button');
                if (i == 0) {
                    this._navButtons[this._emojiCategories[i].icon].classList.add('active');
                }
                elData(this._navButtons[this._emojiCategories[i].icon], 'category-id', this._emojiCategories[i].icon);
                this._navButtons[this._emojiCategories[i].icon].addEventListener(WCF_CLICK_EVENT, this._clickNavButton.bind(this));
                
                var iconSpan = elCreate('span');
                iconSpan.classList.add('icon');
                iconSpan.classList.add('icon16');
                iconSpan.classList.add('fa-' + this._emojiCategories[i].icon);

                this._navButtons[this._emojiCategories[i].icon].append(iconSpan);

                nav.appendChild(this._navButtons[this._emojiCategories[i].icon]);
            }


            navSection.append(nav);
            return navSection;
        },

        _createSearch: function() {
            var searchSection = elCreate('section');
            searchSection.classList.add('searchSection');

            var searchInput = elCreate('input');
            searchInput.setAttribute('type', 'search');

            var placeholder = Language.get('wcf.global.search');
            // Fallback
            if (placeholder == 'wcf.global.search') {
                placeholder = 'Search';
            }

            searchInput.setAttribute('placeholder', placeholder);

            searchInput.addEventListener('input', this._changeSearchValue.bind(this));

            searchSection.append(searchInput);

            return searchSection;
        },

        _createEmojiSections: function() {
            this._emojiSectionDiv = elCreate('div');
            this._emojiSectionDiv.classList.add('emojiSection');

            for (var i = 0; i < this._emojiCategories.length; i++) {
                this._emojiSections[this._emojiCategories[i].icon] = this._createEmojiSection(this._emojiCategories[i]);
                this._emojiSectionDiv.appendChild(this._emojiSections[this._emojiCategories[i].icon]);
            }
            this._emojiSectionDiv.addEventListener('scroll', this._scrollEmojiList.bind(this));

            return this._emojiSectionDiv;
        },

        _createEmojiSection: function(emojiCategory) {
            var emojiSection = elCreate('section');
            elData(emojiSection, 'category-id', emojiCategory.icon);

            // create section Title
            var sectionTitleDiv = elCreate('div');
            sectionTitleDiv.classList.add('sectionTitle');

            var sectionTitleSpan = elCreate('span');
            sectionTitleSpan.innerText = emojiCategory.name;
            sectionTitleDiv.appendChild(sectionTitleSpan);

            emojiSection.appendChild(sectionTitleDiv);

            // create emoji list
            var emojiList = elCreate('ul');
            emojiList.classList.add('emojiList');

            for (var j = 0; j < emojiCategory.emojis.length; j++) {
                var emojiName = emojiCategory.emojis[j];

                if (this._emojis[emojiName] !== undefined && this._emojis[emojiName] !== null) {
                    if (this._firstEmoji === null) {
                        this._firstEmoji = emojiName;
                    }

                    var emojiItem = elCreate('li');

                    var emojiButton = elCreate('button');
                    elData(emojiButton, 'emoji-name', emojiName);

                    var emojiSpan = elCreate('span');
                    var coordinates = this._emojis[emojiName].c;
                    var x = coordinates[0] * -24;
                    var y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = x + 'px ' + y + 'px';

                    emojiButton.addEventListener('mouseover', this._hoverTwemoji.bind(this));
                    emojiButton.addEventListener(WCF_CLICK_EVENT, this._clickTwemoji.bind(this));

                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);

                    emojiList.appendChild(emojiItem);
                }
            }

            emojiSection.appendChild(emojiList);

            return emojiSection;
        },

        _createPreviewSection: function() {
            var previewSection = elCreate('div');
            previewSection.classList.add('previewSection');

            // generate previewContent
            var previewContent = elCreate('div');
            previewContent.classList.add('previewContent');

            // twemoji preview
            this._twemojiPreview = elCreate('span');
            this._twemojiPreview.classList.add('twemojiPreview');

            previewContent.appendChild(this._twemojiPreview);

            // show preview description
            var previewDescription = elCreate('div');
            previewDescription.classList.add('previewDescription');
            
            this._twemojiTitlePreview = elCreate('div');
            this._twemojiTitlePreview.classList.add('twemojiTitle');

            this._twemojiAliasPreview = elCreate('div');
            this._twemojiAliasPreview.classList.add('twemojiAlias');

            previewDescription.appendChild(this._twemojiTitlePreview);
            previewDescription.appendChild(this._twemojiAliasPreview);

            previewContent.appendChild(previewDescription);

            // show first emoji
            if (this._firstEmoji !== null) {
                var coordinates = this._emojis[this._firstEmoji].c;
                var x = coordinates[0] * -24;
                var y = coordinates[1] * -24;
                this._twemojiPreview.style.backgroundPosition = x + 'px ' + y + 'px';

                this._twemojiTitlePreview.innerText = this._emojis[this._firstEmoji].n;
                this._twemojiAliasPreview.innerText = ':' + this._firstEmoji + ':';
            }

            previewSection.append(previewContent);
            return previewSection;
        }
    }

    return TwemojiSelector;
});
