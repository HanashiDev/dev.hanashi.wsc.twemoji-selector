import TwemojiData, { ITwemojiEmo } from "./Data";
import TwemojiUtil from "./Util";

export class TwemojiParser {
  private readonly emojiDataPath: string = window.WCF_PATH + "js/Hanashi/Twemoji/twemoji.json";
  private readonly emojiSize: number = 24;
  private readonly selector: string | undefined = undefined;
  private readonly emojis: ITwemojiEmo;

  constructor(options: any = {}) {
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

    const twemojiData = TwemojiData.getTwemojiData();
    if (twemojiData.emo != null) {
      this.emojis = twemojiData.emo;
    }
    this.parse();
  }

  public parse(selector: string | undefined = undefined): void {
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
      const native = TwemojiUtil.getEmojiByUnifier(emoji.u);
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

export default TwemojiParser;
