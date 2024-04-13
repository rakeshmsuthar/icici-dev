const CryptoJS = require("crypto-js");

class Utility {
  encrypt(input, key) {
    const cipher = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(input),
      CryptoJS.enc.Utf8.parse(key),
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    return cipher.toString();
  }

  decrypt(sStr, key) {
    const decrypted = CryptoJS.AES.decrypt(sStr, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generateSecurehash(sortedData, secret) {
    let secureHash = secret;

    if (sortedData) {
      for (const [key, val] of Object.entries(sortedData)) {
        secureHash += val;
      }
    }

    // Generate SHA-256 hash
    const hashed = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(secureHash));
    const secureHashResult = hashed.toString(CryptoJS.enc.Hex);
    return secureHashResult;
  }

  null2unknown(checkNull, arrayData) {
    return arrayData[checkNull] || "No Value Returned";
  }
}

module.exports = Utility;
