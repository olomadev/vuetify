
import axios from "axios";
import messages from "./locale.json";

/**
 * Oloma Dev.
 * 
 * [@oloma/vuetify] <https://github.com/olomadev/oloma-vuetify>
 *
 * Copyright (c) 2022-2024, Oloma Software.
 */
export default class License {

  constructor(i18n, env) {
    this.env = env;
    this.lang = "en";
    this.i18n = i18n;
    if (typeof i18n.global.locale.value !== "undefined") {
      this.lang = i18n.global.locale.value;
    }
  }

  async check() {
    let error = null;
    if (typeof this.env.VITE_LICENSE_KEY == "undefined" || this.env.VITE_LICENSE_KEY == "") {
      error = this.trans("Oloma configuration error") + this.trans("Please provide a license key");
      alert(error)
      return;
    }
    const host = window.location.host;
    const isProd = this.checkDomain(host);

    if (isProd) { // check for production server
      const metaLicenseTag =  document.querySelector("meta[name='ol:domain-verify']")
      if (! metaLicenseTag) {
          this.sendRequest();
          error = this.trans("Oloma configuration error") + ": " + this.trans("Meta key undefined");
          alert(error);
          return;
      }
      return;
    }
    const lVal = localStorage.getItem(this.getVersionId());
    let Self = this;
    if (!lVal) {
        this.sendRequest();
    }
    return error;
  }

  checkDomain(str) {
     const pattern = new RegExp('^https:\\/\\/' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return !!pattern.test(str);
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

  async sendRequest() {
    axios
      .get(this.getVerifyUrl()  + "/?key=" + this.env.VITE_LICENSE_KEY + "&lang=" + this.lang)
      .then(function (response) {
        if (! response) {
          // let's show connection error in background
          // 
          console.error(this.trans("Oloma configuration error") + Self.trans("Failed to connect to license activation server please make sure you are connected to the internet"));
          return;
        }
        if (response && 
          response["data"] && 
          response["data"]["success"]) {
          localStorage.setItem(Self.getVersionId(), 1);
        } else if (response && 
          response["data"] && 
          response["data"]["error"]) {
          error = this.trans("Oloma configuration error") + response.data.error;
          alert(error)
        }
    });
  }

}