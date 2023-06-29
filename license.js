
import axios from "axios";
import liteCache from "litecache";
import messages from "./locale.json";

/**
 * Oloma (c) 2023
 */
export default class License {

  constructor(i18n , options) {
    this.lang = "en";
    this.i18n = i18n;
    this.licenseKey = "";
    if (typeof options['licenseKey'] !== "undefined") {
        this.licenseKey = options['licenseKey'];
    }
  }

  check() {
    if (typeof this.i18n.global.locale.value !== 'undefined') {
      this.lang = this.i18n.global.locale.value;
    }
    if (this.licenseKey == "") {
      alert(this.trans("Please provide a license key"));
      return
    }
    const lc = new liteCache();
    const lcVal = lc.get(this.getVersionId());
    if (lcVal == "undefined" || lcVal == 0 || lcVal == false) {
      axios
        .get(this.getVerifyUrl()  + "/?key=" + this.licenseKey + "&lang=" + this.lang)
        .then(function (response) {
          if (response.data.success) {
            lc.set(this.getVersionId(), 1);
          } else {
            alert(response.data.error);
          }
      });
    }
  }

  trans(text) {
    if (typeof messages[this.lang][text] == "undefined") {
      return text
    }
    return messages[this.lang][text];
  }

  getVerifyUrl() {
    return "https://license.oloma.dev";
  }

  getVersionId() {
    return "a676cfe6-4ee4-4221-aad6-4b9c5b2dd21c";
  }

}

