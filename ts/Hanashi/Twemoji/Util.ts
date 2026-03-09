export class TwemojiUtil {
  public static getEmojiByUnifier(unifier: string): string {
    return String.fromCodePoint(
      ...unifier.split("-").map((u) => parseInt(u, 16))
    );
  }
}

export default TwemojiUtil;
