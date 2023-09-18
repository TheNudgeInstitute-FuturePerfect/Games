module.exports = {
  isJson: function (data) {
    data = typeof data !== "string" ? JSON.stringify(data) : data;

    try {
      data = JSON.parse(data);
    } catch (e) {
      return false;
    }

    if (typeof data === "object" && data !== null) {
      return true;
    }
    return false;
  },

  getStringRegex: function () {
    let stringRegex = `/[^A-Za-z0-9\\,\\.\\;\-]/`;
    return stringRegex;
  },
  getEmailRegex: function () {
    let emailRegex = `/^\S+\w+([+\.]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})*$/`;
    return emailRegex;
  },

  isValidUTF8: function (buf) {
    return Buffer.compare(new Buffer(buf.toString(), "utf8"), buf) === 0;
  },
};
