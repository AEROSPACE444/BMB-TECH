const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");

const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");

const topDivider = "❒❒❒❒❒❒❒❒❒❒❒❒❒❒❒❒❒";
const categoryDivider = "■■■■■■■■■■■■■■■";

function getBotInfo(mode) {
  moment.tz.setDefault("Africa/Nairobi");
  const currentTime = moment().format("HH:mm:ss");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `
╭━═「 *B.M.B-TECH* 」═━❂
┃⊛╭────••••────➻
┃⊛│📌 *Commands*: ${totalCommands}
┃⊛│☢️ *mode*: ${mode.toUpperCase()}
┃⊛│⌚ *time*: ${currentTime} (EAT)
┃⊛│🖥️ *ram*: ${usedRAM} / ${totalRAM}
┃⊛│ ⚙️ *Status:* ONLINE
┃⊛│🌐 *creator*: B.M.B-XMD
┃⊛└────••••────➻
╰─━━━━══──══━━━❂
`;
}

function buildMenu(coms, prefixe) {
  let menu = `\n🧾 *COMMAND INDEX*\n\n`;

  const categoryStyles = {
    General: "🌐",
    Group: "👥",
    Mods: "🛡️",
    Fun: "🎉",
    Search: "🔎",
    Logo: "🎨",
    Utilities: "🧰",
    Adult: "🔞",
    Download: "📥",
  };

  for (const cat in coms) {
    const icon = categoryStyles[cat] || "🚀";
    menu += `\n${icon} *${cat.toUpperCase()}*\n`;

    coms[cat].forEach((cmd) => {
      menu += `┃◈┃✪ *${prefixe}${cmd}*\n`;
    });

    menu += categoryDivider + "\n";
  }

  menu += `
👨‍💻 *DEVELOPERS*
 ┗ BMB TEAM
 ┗ B.M.B-XMD

📡 Powered by *B.M.B-TECH SYSTEM*
${topDivider}
`;

  return menu;
}

async function sendMenuMedia(zk, dest, ms, caption, mentions) {
  const mediaPath = path.join(__dirname, "../bot/menu2.jpg");

  if (!fs.existsSync(mediaPath)) {
    return zk.sendMessage(dest, { text: "❌ Menu image not found." }, { quoted: ms });
  }

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    mentionedJid: mentions,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "B.M.B-XMD",
      serverMessageId: 143,
    },
  };

  await zk.sendMessage(
    dest,
    {
      image: { url: mediaPath },
      caption,
      footer: "⚡ BMB-XBOT ⚡",
      mentions,
      contextInfo,
    },
    { quoted: ms }
  );
}

async function sendMenuAudio(zk, dest, ms, repondre) {
  const audioPath = path.join(__dirname, "../bmb/menu1.mp3");

  if (!fs.existsSync(audioPath)) {
    return repondre(`⚠️ Audio file not found: menu1.mp3`);
  }

  await zk.sendMessage(
    dest,
    {
      audio: { url: audioPath },
      mimetype: "audio/mpeg",
      ptt: true,
      fileName: `🎵 Menu Sound`,
    },
    { quoted: ms }
  );
}

zokou(
  {
    nomCom: "menu9",
    categorie: "General",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

    for (const com of cm) {
      if (!coms[com.categorie]) coms[com.categorie] = [];
      coms[com.categorie].push(com.nomCom);
    }

    try {
      const infoText = getBotInfo(mode);
      const menuText = buildMenu(coms, prefixe);
      const finalText = infoText + menuText;
      const sender = ms.key.participant || ms.key.remoteJid;

      await sendMenuMedia(zk, dest, ms, finalText, [sender]);
      await sendMenuAudio(zk, dest, ms, repondre);
    } catch (err) {
      console.error(`[MENU ERROR]: ${err}`);
      repondre(`❌ Failed to load menu:\n${err.message}`);
    }
  }
);
