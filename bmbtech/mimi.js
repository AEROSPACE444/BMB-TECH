const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "mimi", categorie: "Menu" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    let coms = {};
    let mode = "public";

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie]) {
            coms[com.categorie] = [];
        }
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭━═「 *${s.BOT}* 」═━❂
┃⊛╭────••••────➻
┃⊛│◆ owner : ${s.OWNER_NAME}
┃⊛│◆ prefix : [ ${s.PREFIXE} ]
┃⊛│◆ mode : *${mode}*
┃⊛│◆ ram  : 𝟴/𝟭𝟯𝟮 𝗚𝗕
┃⊛│◆ date  : *${date}*
┃⊛│◆ platform : ${os.platform()}
┃⊛│◆ creator : 𝙱.𝙼.𝙱-𝚇𝙼𝙳
┃⊛│◆ commdands : ${cm.length}
┃⊛│◆ them : BMB
┃⊛└────••••────➻
╰─━━━━══──══━━━❂\n${readmore}
`;

    let menuMsg = `𝙱.𝙼.𝙱-𝚇𝙼𝙳 𝙲𝚖𝚍`;
    
    for (const cat in coms) {
        menuMsg += `
❁━━〔 *${cat}* 〕━━❁
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
┃★┃🔸 `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
┃★┃🔸 ${s.PREFIXE}  *${cmd}*`;    
        }
        menuMsg += `
┃★┃🔸 
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;
    }
    
    menuMsg += `
> Made By 𝙱.𝙼.𝙱-𝚇𝙼𝙳\n`;

    try {
        const senderName = nomAuteurMessage || message.from;  // Use correct variable for sender name
        await zk.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [senderName],
                externalAdReply: {
                    title: "B.M.B-TECH MENU LIST",
                    body: "Dont worry bro I have more tap to follow",
                    thumbnailUrl: "https://files.catbox.moe/ho5pgt.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵🥵 Menu error: " + error);
    }
});


  
