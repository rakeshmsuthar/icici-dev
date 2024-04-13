const Utility = require("./src/lib/Utility");
const CONSTANTS = require("./src/lib/constant");

class SDK {
  initiate({
    bankId = "",
    passCode = "",
    mcc,
    merchantId,
    terminalId,
    encKey = "",
    saltKey = "",
    returnURL,
    version,
    amount,
    txnRefNo,
    currency,
    txnType,
    orderInfo,
    email,
    phone,
    UDF01,
    UDF02,
    UDF03,
    UDF04,
    UDF05,
    UDF06,
    UDF07,
    UDF08,
    UDF09,
    UDF10,
  }) {
    if (!bankId || bankId.trim() == "") {
      return { status: false, message: "Bank ID is required" };
    }
    if (!passCode || passCode.trim() == "") {
      return { status: false, message: "Pass Code is required" };
    }
    if (!mcc || mcc.trim() == "") {
      return { status: false, message: "MCC is required" };
    }
    if (!merchantId || merchantId.trim() == "") {
      return { status: false, message: "Merchant ID is required" };
    }
    if (!terminalId || terminalId.trim() == "") {
      return { status: false, message: "Terminal ID is required" };
    }
    if (!encKey || encKey.trim() == "") {
      return { status: false, message: "Encryption Key is required" };
    }
    if (!saltKey || saltKey.trim() == "") {
      return { status: false, message: "Salt Key is required" };
    }
    if (!returnURL || returnURL.trim() == "") {
      return { status: false, message: "Return URL is required" };
    }

    const utility = new Utility();

    const EncKey = encKey;
    const SECURE_SECRET = saltKey;
    const gatewayURL = CONSTANTS.GATEWAYURL;

    let data = {
      Version: version,
      PassCode: passCode,
      BankId: bankId,
      MerchantId: merchantId,
      MCC: mcc,
      TerminalId: terminalId,
      ReturnURL: returnURL,
      Amount: parseFloat(amount) * 100,
      TxnRefNo: txnRefNo,
      Currency: currency,
      TxnType: txnType,
      OrderInfo: orderInfo,
      Email: email,
      Phone: phone,
      UDF01: UDF01,
      UDF02: UDF02,
      UDF03: UDF03,
      UDF04: UDF04,
      UDF05: UDF05,
      UDF06: UDF06,
      UDF07: UDF07,
      UDF08: UDF08,
      UDF09: UDF09,
      UDF10: UDF10,
    };

    data = Object.fromEntries(Object.entries(data).sort());

    let dataToPostToPG = "";

    for (const key in data) {
      const value = data[key]?.toString();

      dataToPostToPG += `${key}||${value}::`;
    }

    //Generate Secure hash on parameters
    const SecureHash = utility.generateSecurehash(data, SECURE_SECRET);
    //Appending hash and data with ::
    dataToPostToPG = `SecureHash||${encodeURIComponent(
      SecureHash
    )}::${dataToPostToPG}`;
    //Removing last 2 characters (::)
    dataToPostToPG = dataToPostToPG.slice(0, -2);

    const EncData = utility.encrypt(dataToPostToPG, EncKey);

    return { status: true, data: { gatewayURL, EncData, data } };
  }

  checkResponse({ encKey, saltKey, paymentResponse }) {
    const utility = new Utility();

    if (!encKey || encKey.trim() == "") {
      return { status: false, message: "Encryption Key is required" };
    }
    if (!saltKey || saltKey.trim() == "") {
      return { status: false, message: "Salt Key is required" };
    }
    if (!paymentResponse || paymentResponse?.trim() == "") {
      return { status: false, message: "Payment Response is required" };
    }

    const EncKey = encKey;
    const SECURE_SECRET = saltKey;
    const paymentResponse = paymentResponse;

    const decodedPaymentResponse = decodeURIComponent(paymentResponse);

    if (!decodedPaymentResponse) {
      return { status: false, message: "Invalid data" };
    }

    const jsonData = JSON.parse(decodedPaymentResponse);
    const EncData = jsonData["EncData"] || "";
    const merchantId = jsonData["MerchantId"] || "";
    const bankID = jsonData["BankId"] || "";
    const terminalId = jsonData["TerminalId"] || "";

    if (
      bankID?.trim() == "" ||
      merchantId?.trim() == "" ||
      terminalId?.trim() == "" ||
      EncData?.trim() == ""
    ) {
      return { status: false, message: "Invalid data" };
    }

    const fomattedEncData = EncData?.replace(/ /g, "+");
    const data = utility.decrypt(fomattedEncData, EncKey);

    const dataArray = data?.split("::");

    let dataFromPostFromPG = {};

    for (const value of dataArray) {
      const valueSplit = value.split("||");
      dataFromPostFromPG[valueSplit[0]] = decodeURIComponent(valueSplit[1]);
    }

    const SecureHash = dataFromPostFromPG["SecureHash"];

    delete dataFromPostFromPG.SecureHash;

    const abc = Object.fromEntries(
      Object.entries(dataFromPostFromPG).filter(([key, value]) => value)
    );

    const sortedAbc = Object.fromEntries(
      Object.entries(abc).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const secureHashFinal = utility
      .generateSecurehash(sortedAbc, SECURE_SECRET)
      .toUpperCase();

    let hashValidated = "Invalid Hash";

    if (secureHashFinal === SecureHash) {
      return { status: true, data: { dataFromPostFromPG } };
    } else {
      return { status: false, message: hashValidated };
    }
  }
}

module.exports = SDK;
