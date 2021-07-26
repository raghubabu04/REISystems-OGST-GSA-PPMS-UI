export class PageUtils {
  static getFormattedPhone = (phoneNumberString: any) => {
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      let intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return null;
  };

  static getFormattedCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  };

  static setCustomValidity = (target, message: string) => {
    if (target) {
      if (!message || message.length === 0) {
        target.setCustomValidity("");
      } else {
        target.setCustomValidity(message);
      }
    }
  };

  static isUrlValid = (url: string) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  };

  static getFormattedPercentage = (num: any) => {
    return (num * 100).toFixed(0) + "%";
  };

  static pluralizeResults = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 && count !== 0 ? suffix : ""}`;
}
