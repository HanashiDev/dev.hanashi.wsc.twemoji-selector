define(["require", "exports", "tslib", "WoltLabSuite/Core/Language", "./Data", "./Util"], function (require, exports, tslib_1, Language, Data_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwemojiSelector = void 0;
    Language = tslib_1.__importStar(Language);
    Data_1 = tslib_1.__importDefault(Data_1);
    Util_1 = tslib_1.__importDefault(Util_1);
    class TwemojiSelector {
        // options
        selector = "twemoji-selector";
        emojiDataPath = window.WCF_PATH + "js/Hanashi/Twemoji/twemoji.json";
        theme = "light";
        callback = undefined;
        // cache variables
        emojiCategories = [];
        emojis = {};
        navButtons = {};
        isSearching = false;
        emojiSectionDiv = undefined;
        emojiSections = {};
        emojiSectionSearchDiv = undefined;
        firstEmoji = undefined;
        // preview variables
        twemojiPreview = undefined;
        twemojiTitlePreview = undefined;
        twemojiAliasPreview = undefined;
        constructor(options = {}) {
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
            document.querySelectorAll(this.selector).forEach((value) => this.generateSelectorView(value));
        }
        generateSelectorView(element) {
            const wrapper = this.createWrapper();
            wrapper.appendChild(this.createNav());
            wrapper.appendChild(this.createSearch());
            wrapper.appendChild(this.createEmojiSections());
            wrapper.appendChild(this.createPreviewSection());
            element.append(wrapper);
        }
        // create methods
        createWrapper() {
            const wrapper = document.createElement("div");
            wrapper.classList.add("twemojiSelector");
            if (this.theme == "dark") {
                wrapper.classList.add("dark");
            }
            else if (this.theme == "light") {
                wrapper.classList.add("light");
            }
            return wrapper;
        }
        createNav() {
            const navSection = document.createElement("div");
            navSection.classList.add("navSection");
            const nav = document.createElement("nav");
            let i = 0;
            for (const emojiCategory of this.emojiCategories) {
                this.navButtons[emojiCategory.icon] = document.createElement("button");
                if (i == 0) {
                    this.navButtons[emojiCategory.icon].classList.add("active");
                }
                this.navButtons[emojiCategory.icon].dataset.categoryId = emojiCategory.icon;
                this.navButtons[emojiCategory.icon].addEventListener("click", (ev) => this.clickNavButton(ev));
                const iconSpan = document.createElement("fa-icon");
                iconSpan.size = 16;
                iconSpan.setIcon(emojiCategory.icon, true);
                this.navButtons[emojiCategory.icon].append(iconSpan);
                nav.appendChild(this.navButtons[emojiCategory.icon]);
                i++;
            }
            navSection.append(nav);
            return navSection;
        }
        createSearch() {
            const searchSection = document.createElement("section");
            searchSection.classList.add("searchSection");
            const searchInput = document.createElement("input");
            searchInput.setAttribute("type", "search");
            let placeholder = Language.get("wcf.global.search");
            // Fallback
            if (placeholder == "wcf.global.search") {
                placeholder = "Search";
            }
            searchInput.setAttribute("placeholder", placeholder);
            searchInput.addEventListener("input", (ev) => this.changeSearchValue(ev));
            searchSection.append(searchInput);
            return searchSection;
        }
        createEmojiSections() {
            this.emojiSectionDiv = document.createElement("div");
            this.emojiSectionDiv.classList.add("emojiSection");
            for (const emojiCategory of this.emojiCategories) {
                this.emojiSections[emojiCategory.icon] = this.createEmojiSection(emojiCategory);
                this.emojiSectionDiv.appendChild(this.emojiSections[emojiCategory.icon]);
            }
            this.emojiSectionDiv.addEventListener("scroll", (ev) => this.scrollEmojiList(ev));
            return this.emojiSectionDiv;
        }
        createEmojiSection(emojiCategory) {
            const emojiSection = document.createElement("section");
            emojiSection.dataset.categoryId = emojiCategory.icon;
            // create section Title
            const sectionTitleDiv = document.createElement("div");
            sectionTitleDiv.classList.add("sectionTitle");
            const sectionTitleSpan = document.createElement("span");
            sectionTitleSpan.innerText = emojiCategory.name;
            sectionTitleDiv.appendChild(sectionTitleSpan);
            emojiSection.appendChild(sectionTitleDiv);
            // create emoji list
            const emojiList = document.createElement("ul");
            emojiList.classList.add("emojiList");
            for (const emojiName of emojiCategory.emojis) {
                if (this.emojis[emojiName] !== undefined && this.emojis[emojiName] !== null) {
                    if (this.firstEmoji == null) {
                        this.firstEmoji = emojiName;
                    }
                    const emojiItem = document.createElement("li");
                    const emojiButton = document.createElement("button");
                    emojiButton.dataset.emojiName = emojiName;
                    const emojiSpan = document.createElement("span");
                    const coordinates = this.emojis[emojiName].c;
                    const x = coordinates[0] * -24;
                    const y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = `${x}px ${y}px`;
                    emojiButton.addEventListener("mouseover", (ev) => this.hoverTwemoji(ev));
                    emojiButton.addEventListener("click", (ev) => this.clickTwemoji(ev));
                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);
                    emojiList.appendChild(emojiItem);
                }
            }
            emojiSection.appendChild(emojiList);
            return emojiSection;
        }
        createPreviewSection() {
            const previewSection = document.createElement("div");
            previewSection.classList.add("previewSection");
            // generate previewContent
            const previewContent = document.createElement("div");
            previewContent.classList.add("previewContent");
            // twemoji preview
            this.twemojiPreview = document.createElement("span");
            this.twemojiPreview.classList.add("twemojiPreview");
            previewContent.appendChild(this.twemojiPreview);
            // show preview description
            const previewDescription = document.createElement("div");
            previewDescription.classList.add("previewDescription");
            this.twemojiTitlePreview = document.createElement("div");
            this.twemojiTitlePreview.classList.add("twemojiTitle");
            this.twemojiAliasPreview = document.createElement("div");
            this.twemojiAliasPreview.classList.add("twemojiAlias");
            previewDescription.appendChild(this.twemojiTitlePreview);
            previewDescription.appendChild(this.twemojiAliasPreview);
            previewContent.appendChild(previewDescription);
            // show first emoji
            if (this.firstEmoji != null) {
                const coordinates = this.emojis[this.firstEmoji].c;
                const x = coordinates[0] * -24;
                const y = coordinates[1] * -24;
                this.twemojiPreview.style.backgroundPosition = `${x}px ${y}px`;
                this.twemojiTitlePreview.innerText = this.emojis[this.firstEmoji].n;
                this.twemojiAliasPreview.innerText = ":" + this.firstEmoji + ":";
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
            const button = target.closest("button");
            if (button == null) {
                return;
            }
            const categoryID = button.dataset.categoryId;
            if (categoryID == null) {
                return;
            }
            if (this.emojiSections[categoryID] == null || this.emojiSectionDiv == null) {
                return;
            }
            this.emojiSectionDiv.scrollTop = this.emojiSections[categoryID].offsetTop; // - this.emojiSectionDiv.offsetTop;
        }
        changeSearchValue(e) {
            const target = e.target;
            if (target == null) {
                return;
            }
            if (target.value) {
                this.isSearching = true;
                this.generateSearchResult(target.value);
            }
            else {
                this.isSearching = false;
                this.emojiSectionSearchDiv?.remove();
                this.emojiSectionSearchDiv = undefined;
                this.emojiSectionDiv?.style.removeProperty("display");
            }
        }
        hoverTwemoji(e) {
            if (this.twemojiPreview == null || this.twemojiTitlePreview == null || this.twemojiAliasPreview == null) {
                return;
            }
            const target = e.target;
            const button = target.closest("button");
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
            this.twemojiPreview.style.backgroundPosition = `${x}px ${y}px`;
            this.twemojiTitlePreview.innerText = this.emojis[emojiName].n;
            this.twemojiAliasPreview.innerText = ":" + emojiName + ":";
        }
        clickTwemoji(e) {
            e.preventDefault();
            const target = e.target;
            const button = target.closest("button");
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
            const returnData = {
                id: emojiName,
                colons: ":" + emojiName + ":",
                name: emoji.n,
                coordinates: emoji.c,
                unified: emoji.u,
                native: native,
            };
            if (emoji.a !== undefined && emoji.a !== null) {
                returnData["alias"] = emoji.a;
            }
            if (this.callback != null && typeof this.callback === "function") {
                this.callback(returnData);
            }
            else {
                console.error("no callback specified");
            }
        }
        scrollEmojiList(e) {
            if (this.isSearching) {
                return;
            }
            const target = e.target;
            for (const key in this.emojiSections) {
                const section = this.emojiSections[key];
                const rect = section.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                const isVisible = rect.y <= targetRect.top && rect.y > targetRect.top - rect.height;
                if (isVisible) {
                    this.navButtons[key].classList.add("active");
                }
                else {
                    this.navButtons[key].classList.remove("active");
                }
            }
        }
        //event methods end
        //search result
        generateSearchResult(value) {
            value = value.toLowerCase();
            this.emojiSectionSearchDiv?.remove();
            this.emojiSectionSearchDiv = document.createElement("div");
            this.emojiSectionSearchDiv.classList.add("emojiSection");
            const emojiSection = document.createElement("section");
            // create section Title
            const sectionTitleDiv = document.createElement("div");
            sectionTitleDiv.classList.add("sectionTitle");
            const sectionTitleSpan = document.createElement("span");
            sectionTitleSpan.innerText = "Search result: " + value;
            sectionTitleDiv.appendChild(sectionTitleSpan);
            emojiSection.appendChild(sectionTitleDiv);
            // create emoji list
            const emojiList = document.createElement("ul");
            emojiList.classList.add("emojiList");
            for (const [emoji, emojiData] of Object.entries(this.emojis)) {
                if (emoji.includes(value) || emojiData.n.toLowerCase().includes(value)) {
                    const emojiItem = document.createElement("li");
                    const emojiButton = document.createElement("button");
                    emojiButton.dataset.emojiName = emoji;
                    const emojiSpan = document.createElement("span");
                    const coordinates = emojiData.c;
                    const x = coordinates[0] * -24;
                    const y = coordinates[1] * -24;
                    emojiSpan.style.backgroundPosition = `${x}px ${y}px`;
                    emojiButton.addEventListener("mouseover", (ev) => this.hoverTwemoji(ev));
                    emojiButton.addEventListener("click", (ev) => this.clickTwemoji(ev));
                    emojiButton.append(emojiSpan);
                    emojiItem.append(emojiButton);
                    emojiList.appendChild(emojiItem);
                }
            }
            emojiSection.appendChild(emojiList);
            this.emojiSectionSearchDiv.append(emojiSection);
            this.emojiSectionDiv?.style.setProperty("display", "none", "");
            this.emojiSectionDiv?.parentNode?.insertBefore(this.emojiSectionSearchDiv, this.emojiSectionDiv.nextSibling);
        }
    }
    exports.TwemojiSelector = TwemojiSelector;
    exports.default = TwemojiSelector;
});
