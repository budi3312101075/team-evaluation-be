const dayjs = require("dayjs");
const path = require("path");

const dateValue = () => {
  return dayjs().format("YYYY-MM-DD-HH:mm:ss");
};
const fileDir = () => path.join(__dirname, "../../files");

module.exports = { dateValue, fileDir };
