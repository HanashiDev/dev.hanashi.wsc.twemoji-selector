var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "WoltLabSuite/Core/Language", "./Data", "./Util"], function (require, exports, Language, Data_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwemojiSelector = void 0;
    Language = __importStar(Language);
    Data_1 = __importDefault(Data_1);
    Util_1 = __importDefault(Util_1);
    class TwemojiSelector {
        constructor(options = {}) {
            // options
            this.selector = 'twemoji-selector';
            this.emojiDataPath = window.WCF_PATH + 'js/Hanashi/Twemoji/twemoji.json';
            this.theme = 'light';
            this.callback = undefined;
            // cache variables
            this.emojiCategories = [];
            this.emojis = {};
            this.navButtons = {};
            this.isSearching = false;
            this.emojiSectionDiv = undefined;
            this.emojiSections = {};
            this.emojiSectionSearchDiv = undefined;
            this.firstEmoji = undefined;
            // preview variables
            this.twemojiPreview = undefined;
            this.twemojiTitlePreview = undefined;
            this.twemojiAliasPreview = undefined;
            if (options.selector != null) {
                this.selector = options.selector;
            }
            if (options.dataPath != null) {
                this.emojiDataPath = options.dataPath;
            }
            if (options.theme != null) {
                this.theme = options.theme;
            }
            if (options.callback != null) {
                this.callback = options.callback;
            }
            const twemojiData = Data_1.default.getTwemojiData();
            if (twemojiData.cat != null) {
                this.emojiCategories = twemojiData.cat;
            }
            if (twemojiData.emo != null) {
                this.emojis = twemojiData.emo;
            }
            this.generateSelectorViews();
        }
        generateSelectorViews() {
            document.querySelectorAll(this.selector).forEach(value => this.generateSelectorView(value));
        }
        generateSelectorView(element) {
            let wrapper = this.createWrapper();
            wrapper.appendChild(this.createNav());
            wrapper.appendChild(this.createSearch());
            wrapper.appendChild(this.createEmojiSections());
            wrapper.appendChild(this.createPreviewSection());
            element.append(wrapper);
        }
        // create methods
        createWrapper() {
            const wrapper = document.createElement('div');
            wrapper.classList.add('twemojiSelector');
            if (this.theme == 'dark') {
                wrapper.classList.add('dark');
            }
            else if (this.theme == 'light') {
                wrapper.classList.add('light');
            }
            return wrapper;
        }
        createNav() {
            let navSection = document.createElement('div');
            navSection.classList.add('navSection');
            const nav = document.createElement('nav');
            let i = 0;
            for (let emojiCategory of this.emojiCategories) {
                this.navButtons[emojiCategory.icon] = document.createElement('button');
                if (i == 0) {
                    this.navButtons[emojiCategory.icon].classList.add('active');
                }
                this.navButtons[emojiCategory.icon].dataset.categoryId = emojiCategory.icon;
                this.navButtons[emojiCategory.icon].addEventListener('click', (ev) => this.clickNavButton(ev));
                const iconSpan = document.createElement('span');
                iconSpan.classList.add('icon');
                iconSpan.classList.add('icon16');
                iconSpan.classList.add('fa-' + emojiCategory.icon);
                this.navButtons[emojiCategory.icon].append(iconSpan);
                nav.appendChild(this.navButtons[emojiCategory.icon]);
                i++;
            }
            navSection.append(nav);
            return navSection;
        }
        createSearch() {
            const searchSection = document.createElement('section');
            searchSection.classList.add('searchSection');
            const searchInput = document.createElement('input');
            searchInput.setAttribute('type', 'search');
            var placeholder = Language.get('wcf.global.search');
            // Fallback
            if (placeholder == 'wcf.global.search') {
                placeholder = 'Search';
            }
            searchInput.setAttribute('placeholder', placeholder);
            searchInput.addEventListener('input', (ev) => this.changeSearchValue(ev));
            searchSection.append(searchInput);
            return searchSection;
        }
        createEmojiSections() {
            this.emojiSectionDiv = document.createElement('div');
            this.emojiSectionDiv.classList.add('emojiSection');
            for (let emojiCategory of this.emojiCategories) {
                this.emojiSections[emojiCategory.icon] = this.createEmojiSection(emojiCategory);
                this.emojiSectionDiv.appendChild(this.emojiSections[emojiCategory.icon]);
            }
            this.emojiSectionDiv.addEventListener('scroll', (ev) => this.scrollEmojiList(ev));
            return this.emojiSectionDiv;
        }
        createEmojiSection(emojiCategory) {
            const emojiSection = document.createElement('section');
            emojiSection.dataset.categoryId = emojiCategory.icon;
            // create section Title
            const sectionTitleDiv = document.createElement('div');
            sectionTitleDiv.classList.add('sectionTitle');
            const sectionTitleSpan = document.createElement('span');
            sectionTitleSpan.innerText = emojiCategory.name;
            sectionTitleDiv.appendChild(sectionTitleSpan);
            emojiSection.appendChild(sectionTitleDiv);
            // create emoji list
            const emojiList = document.createElement('ul');
            emojiList.classList.add('emojiList');
            for (let emojiName of emojiCategory.emojis) {
                if (this.emojis[emojiName] !== undefined && this.emojis[emojiName] !== null) {
                    if (this.firstEmoji == null) {
                        this.firstEmoji = emojiName;
                    }
                    const emojiItem = document.createElement('li');
                    const emojiButton = document.createElement('button');
                    emojiButton.dataset.emojiName = emojiName;
                    const emojiSpan = document.createElement('span');
                    const coordinates = this.emojis[emojiName].c;
                    const x = coordinates[0] * -24;
                    const y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = x + 'px ' + y + 'px';
                    emojiButton.addEventListener('mouseover', (ev) => this.hoverTwemoji(ev));
                    emojiButton.addEventListener('click', (ev) => this.clickTwemoji(ev));
                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);
                    emojiList.appendChild(emojiItem);
                }
            }
            emojiSection.appendChild(emojiList);
            return emojiSection;
        }
        createPreviewSection() {
            const previewSection = document.createElement('div');
            previewSection.classList.add('previewSection');
            // generate previewContent
            const previewContent = document.createElement('div');
            previewContent.classList.add('previewContent');
            // twemoji preview
            this.twemojiPreview = document.createElement('span');
            this.twemojiPreview.classList.add('twemojiPreview');
            previewContent.appendChild(this.twemojiPreview);
            // show preview description
            const previewDescription = document.createElement('div');
            previewDescription.classList.add('previewDescription');
            this.twemojiTitlePreview = document.createElement('div');
            this.twemojiTitlePreview.classList.add('twemojiTitle');
            this.twemojiAliasPreview = document.createElement('div');
            this.twemojiAliasPreview.classList.add('twemojiAlias');
            previewDescription.appendChild(this.twemojiTitlePreview);
            previewDescription.appendChild(this.twemojiAliasPreview);
            previewContent.appendChild(previewDescription);
            // show first emoji
            if (this.firstEmoji != null) {
                const coordinates = this.emojis[this.firstEmoji].c;
                const x = coordinates[0] * -24;
                const y = coordinates[1] * -24;
                this.twemojiPreview.style.backgroundPosition = x + 'px ' + y + 'px';
                this.twemojiTitlePreview.innerText = this.emojis[this.firstEmoji].n;
                this.twemojiAliasPreview.innerText = ':' + this.firstEmoji + ':';
            }
            previewSection.append(previewContent);
            return previewSection;
        }
        // create methods end
        // event methods
        clickNavButton(e) {
            e.preventDefault();
            if (this.isSearching)
                return;
            const target = e.target;
            var button = target.closest('button');
            if (button == null) {
                return;
            }
            var categoryID = button.dataset.categoryId;
            if (categoryID == null) {
                return;
            }
            if (this.emojiSections[categoryID] == null || this.emojiSectionDiv == null) {
                return;
            }
            this.emojiSectionDiv.scrollTop = this.emojiSections[categoryID].offsetTop - this.emojiSectionDiv.offsetTop;
        }
        changeSearchValue(e) {
            var _a, _b;
            var target = e.target;
            if (target == null) {
                return;
            }
            if (target.value) {
                this.isSearching = true;
                this.generateSearchResult(target.value);
            }
            else {
                this.isSearching = false;
                (_a = this.emojiSectionSearchDiv) === null || _a === void 0 ? void 0 : _a.remove();
                this.emojiSectionSearchDiv = undefined;
                (_b = this.emojiSectionDiv) === null || _b === void 0 ? void 0 : _b.style.removeProperty("display");
            }
        }
        hoverTwemoji(e) {
            if (this.twemojiPreview == null || this.twemojiTitlePreview == null || this.twemojiAliasPreview == null) {
                return;
            }
            const target = e.target;
            const button = target.closest('button');
            if (button == null) {
                return;
            }
            const emojiName = button.dataset.emojiName;
            if (emojiName == null) {
                return;
            }
            if (this.emojis[emojiName] == null) {
                return;
            }
            const coordinates = this.emojis[emojiName].c;
            const x = coordinates[0] * -24;
            const y = coordinates[1] * -24;
            this.twemojiPreview.style.backgroundPosition = x + 'px ' + y + 'px';
            this.twemojiTitlePreview.innerText = this.emojis[emojiName].n;
            this.twemojiAliasPreview.innerText = ':' + emojiName + ':';
        }
        clickTwemoji(e) {
            e.preventDefault();
            const target = e.target;
            const button = target.closest('button');
            if (button == null) {
                return;
            }
            const emojiName = button.dataset.emojiName;
            if (emojiName == null) {
                return;
            }
            if (this.emojis[emojiName] == null) {
                return;
            }
            const emoji = this.emojis[emojiName];
            const native = Util_1.default.getEmojiByUnifier(emoji.u);
            let returnData = {
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
            if (this.callback != null && typeof this.callback === 'function') {
                this.callback(returnData);
            }
            else {
                console.error('no callback specified');
            }
        }
        scrollEmojiList(e) {
            if (this.isSearching) {
                return;
            }
            let target = e.target;
            for (var key in this.emojiSections) {
                const section = this.emojiSections[key];
                var rect = section.getBoundingClientRect();
                var targetRect = target.getBoundingClientRect();
                var isVisible = rect.y <= targetRect.top && rect.y > (targetRect.top - rect.height);
                if (isVisible) {
                    this.navButtons[key].classList.add('active');
                }
                else {
                    this.navButtons[key].classList.remove('active');
                }
            }
        }
        //event methods end
        //search result
        generateSearchResult(value) {
            var _a, _b, _c, _d;
            value = value.toLowerCase();
            (_a = this.emojiSectionSearchDiv) === null || _a === void 0 ? void 0 : _a.remove();
            this.emojiSectionSearchDiv = document.createElement('div');
            this.emojiSectionSearchDiv.classList.add('emojiSection');
            const emojiSection = document.createElement('section');
            // create section Title
            const sectionTitleDiv = document.createElement('div');
            sectionTitleDiv.classList.add('sectionTitle');
            const sectionTitleSpan = document.createElement('span');
            sectionTitleSpan.innerText = 'Search result: ' + value;
            sectionTitleDiv.appendChild(sectionTitleSpan);
            emojiSection.appendChild(sectionTitleDiv);
            // create emoji list
            const emojiList = document.createElement('ul');
            emojiList.classList.add('emojiList');
            for (let [emoji, emojiData] of Object.entries(this.emojis)) {
                if (emoji.includes(value) || emojiData.n.toLowerCase().includes(value)) {
                    const emojiItem = document.createElement('li');
                    const emojiButton = document.createElement('button');
                    emojiButton.dataset.emojiName = emoji;
                    const emojiSpan = document.createElement('span');
                    const coordinates = emojiData.c;
                    const x = coordinates[0] * -24;
                    const y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = x + 'px ' + y + 'px';
                    emojiButton.addEventListener('mouseover', (ev) => this.hoverTwemoji(ev));
                    emojiButton.addEventListener('click', (ev) => this.clickTwemoji(ev));
                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);
                    emojiList.appendChild(emojiItem);
                }
            }
            emojiSection.appendChild(emojiList);
            this.emojiSectionSearchDiv.append(emojiSection);
            (_b = this.emojiSectionDiv) === null || _b === void 0 ? void 0 : _b.style.setProperty("display", "none", "");
            (_d = (_c = this.emojiSectionDiv) === null || _c === void 0 ? void 0 : _c.parentNode) === null || _d === void 0 ? void 0 : _d.insertBefore(this.emojiSectionSearchDiv, this.emojiSectionDiv.nextSibling);
        }
    }
    exports.TwemojiSelector = TwemojiSelector;
    exports.default = TwemojiSelector;
});
