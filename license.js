
import axios from "axios";
import messages from "./locale.json";

/*!
 * Oloma Dev.
 * [oloma-va] <https://github.com/olomadev/oloma-va>
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

  check() {
    let error = null;
    if (typeof this.env.MODE == "undefined" || this.env.MODE == "") {
      error = "Oloma configuration error: " + this.trans("Please set an environment variable");
      return error;
    }
    const envArray = ['prod', 'local', 'dev', 'test'];
    if (! envArray.includes(this.env.MODE)) {
      error = "Oloma configuration error: " + this.trans("This software can only be used with these environment variables");
      return error;
    }
    if (this.env.MODE == "prod" && this.env.PROD) {
      return null;
    }
    if (typeof this.env.VITE_LICENSE_KEY == "undefined" || this.env.VITE_LICENSE_KEY == "") {
      error = "Oloma configuration error: " + this.trans("Please provide a license key");
      return error;
    }
    const lVal = localStorage.getItem(this.getVersionId());
    let Self = this;
    if (!lVal) {
      axios
        .get(this.getVerifyUrl()  + "/?key=" + this.env.VITE_LICENSE_KEY + "&lang=" + this.lang)
        .then(function (response) {
          if (! response) {
            error = "Oloma configuration error: " + Self.trans("Failed to connect to license activation server please make sure you are connected to the internet");
            alert(error)
          }
          if (response && 
            response["data"] && 
            response["data"]["success"]) {
            localStorage.setItem(Self.getVersionId(), 1);
          } else if (response && 
            response["data"] && 
            response["data"]["error"]) {
            error = "Oloma configuration error: " + response.data.error;
            alert(error)
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