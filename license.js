
import axios from "axios";
import liteCache from "litecache";
import messages from "./locale.json";

/**
 * Oloma (c) 2023
 */
export default class License {

  check(i18n) {
    this.lang = "en";
    if (typeof i18n.global.locale.value !== 'undefined') {
      this.lang = i18n.global.locale.value;
    }
    const lc = new liteCache();
    const licenseKey = import.meta.env.VITE_LICENSE_KEY;
    if (licenseKey == "") {
      alert(this.trans("Please provide a license key"));  
    }
    const lcVal = lc.get(this.getVersionId());
    if (lcVal == "undefined" || lcVal == 0 || lcVal == false) {
      axios
        .get(this.getVerifyUrl()  + "/?key=" + licenseKey + "&lang=" + this.lang)
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

