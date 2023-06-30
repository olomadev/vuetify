
import axios from "axios";
import messages from "./locale.json";

/**
 * Oloma (c) 2023
 */
export default class License {

  constructor(i18n , meta) {
    this.lang = "en";
    this.i18n = i18n;
    this.options = options;
    this.meta = meta;
    if (typeof i18n.global.locale.value !== "undefined") {
      this.lang = i18n.global.locale.value;
    }
  }

  check() {
    if (typeof this.meta.env.MODE == "undefined" || this.meta.env.MODE == "") {
      alert(this.trans("Please set an environment variable"));
      return;   
    }
    const envArray = ['prod', 'local', 'dev', 'test'];
    if (! envArray.includes(this.meta.env.MODE)) {
      alert(this.trans("This software can only be used with these environment variables"));
      return; 
    }
    if (this.meta.env.MODE == "prod" && this.meta.env.PROD) {
      return;
    }
    if (typeof this.meta.env.VITE_LICENSE_KEY !== "undefined" || this.meta.env.VITE_LICENSE_KEY == "") {
      alert(this.trans("Please provide a license key"));
      return
    }
    const lVal = localStorage.getItem(this.getVersionId());
    let Self = this;
    if (!lVal) {
      axios
        .get(this.getVerifyUrl()  + "/?key=" + licenseKey + "&lang=" + this.lang)
        .then(function (response) {
          if (response.data.success) {
            localStorage.setItem(Self.getVersionId(), 1);
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

