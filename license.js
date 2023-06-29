
import axios from "axios";
import messages from "./locale.json";

/**
 * Oloma (c) 2023
 */
export default class License {

  constructor(i18n , options) {
    this.lang = "en";
    this.i18n = i18n;
    this.options = options;
    
    console.error(import.meta.env);
    // console.error(import.meta.env.PROD);

  }

  check() {
    if (typeof this.options['env'] == "undefined") {
      alert(this.trans("Please set an environment variable"));
      return;   
    }
    const envArray = ['prod', 'local', 'dev', 'test'];
    if (! envArray.includes(this.options['env'])) {
      alert(this.trans("This software can only be used with these environment variables"));
      return; 
    }
    if (this.options['env'] == "prod") {
      return;
    }
    if (typeof this.options['licenseKey'] !== "undefined" || this.options['licenseKey'] == "") {
      alert(this.trans("Please provide a license key"));
      return
    }
    const lVal = localStorage.getItem(this.getVersionId());
    let Self = this;
    if (!lVal) {
      if (typeof Self.i18n.global.locale.value !== 'undefined') {
        Self.lang = Self.i18n.global.locale.value;
      }
      axios
        .get(this.getVerifyUrl()  + "/?key=" + licenseKey + "&lang=" + Self.lang)
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

