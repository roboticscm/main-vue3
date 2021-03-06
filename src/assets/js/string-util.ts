export class StringUtil {
  public static toSnackCase(str: string, sep: string) {
    let ret = '';
    for (let i = 0; i < str.length; i++) {
      let ch = str[i];
      if (ch === ch.toUpperCase()) {
        ret += sep + ch.toLowerCase();
      } else ret += ch;
    }

    return ret;
  }

  public static insertAt(source: string, insString: string, pos: number) {
    if (typeof pos == 'undefined' || pos < 0) {
      pos = 0;
    }

    if (pos > source.length) {
      pos = source.length;
    }

    if (typeof insString == 'undefined') {
      insString = '';
    }
    return source.slice(0, pos) + insString + source.slice(pos);
  }

  public static isEmpty(source: string) {
    return source === null || source === undefined || source.trim().length === 0;
  }

  public static replaceAll(source: string, find: string, replace: string) {
    return source.replace(new RegExp(find, 'g'), replace);
  }

  public static replaceAlls(source: string, finds: string[], replaces: string[]) {
    if (finds.length === 0 || replaces.length === 0 || StringUtil.isEmpty(source) || finds.length !== replaces.length) {
      return source;
    }
    let replaceStr = StringUtil.replaceAll(source, finds[0], replaces[0]);

    for (let i = 1; i < finds.length; i++) {
      replaceStr = StringUtil.replaceAll(replaceStr, finds[i], replaces[i]);
    }

    return replaceStr;
  }
}
