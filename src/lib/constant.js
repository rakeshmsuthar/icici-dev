const CONSTANTS = {
  ENC_KEY: "1FF49170C8CCECFF1345B38F971CABBD",
  SECURE_SECRET: "5FF1003BD85EC13EDDE106AC235F58AD",
  VERSION: "1",
  PASSCODE: "TSFC9767",
  MERCHANTID: "100000000005464",
  TERMINALID: "EG000406",
  BANKID: "24520",
  MCC: "5651",
  GATEWAYURL:
    "https://payuatrbac.icicibank.com/accesspoint/angularBackEnd/requestproxypass",
  REFUNDURL:
    "https://payuatrbac.icicibank.com/accesspoint/v1/24520/createRefundFromMerchantKit",
  STATUSURL:
    "https://payuatrbac.icicibank.com/accesspoint/v1/24520/checkStatusMerchantKit",
  RETURNURL: "https://dev.digiinterface.com/2024/icici_pg/HandleResponse.php",
};

module.exports = CONSTANTS;
