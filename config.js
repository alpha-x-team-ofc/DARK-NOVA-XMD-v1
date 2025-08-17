const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "YOUR SESSION",
  OWNER_NUM: process.env.OWNER_NUM || "94752978237 / 94770349867",
  PREFIX: process.env.PREFIX || ".",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/dula9x/DARK-NOVA-XMD-V1-WEB-PAIR/blob/main/images/WhatsApp%20Image%202025-08-15%20at%2017.22.03_c520eb7b.jpg?raw=true",
  ALIVE_MSG: process.env.ALIVE_MSG || "Iam Alive Now!! ᴅᴀʀᴋ ɴᴏᴠᴀ xᴍᴅ 🤭💗 ආහ් පැටියෝ කොහොමද ?🌝!\n\n🥶ＭＡＤＥ ＢＹ ＡＬＰＨＡ Ｘ ＴＥＡＭ🥶",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "public",
  AUTO_VOICE: process.env.AUTO_VOICE || "true",
  AUTO_STICKER: process.env.AUTO_STICKER || "true",
  AUTO_REPLY: process.env.AUTO_REPLY || "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyA4NEiRrKlN6AuUGU_eaRzPjPUXAeo4ZrA",
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|9d3c4942490b636ca58c82c6da4a599039358cdc"
};
