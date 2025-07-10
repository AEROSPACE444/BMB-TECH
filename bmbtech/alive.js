const { zokou } = require('../framework/zokou');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../bdd/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const path = require("path");
const fs = require("fs");

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
      serverMessageId: 1
    }
  }
};

// Function to send random image from /scs folder
async function sendAliveImage(zk, dest, ms, caption, repondre) {
    const scsFolder = path.join(__dirname, "../scs");
    const images = fs.readdirSync(scsFolder).filter(f => /^menu\d+\.jpg$/i.test(f));
    if (images.length === 0) return repondre("📁 No images found in /scs folder.");

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(scsFolder, randomImage);

    await zk.sendMessage(dest, {
        image: { url: imagePath },
        caption: caption,
        ...newsletterContext
    }, { quoted: ms });
}

zokou(
    {
        nomCom: 'alive11',
        categorie: 'General',
        reaction: "⚡"
    },
    async (dest, zk, { ms, arg, repondre, superUser }) => {
        const data = await getDataFromAlive();
        const time = moment().tz('Etc/GMT').format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        if (!arg || !arg[0]) {
            const aliveMsg = `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃     𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗔𝗟𝗜𝗩𝗘      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📅 Date    : ${date}      
┃ 🕒 Time    : ${time}      
┃ 👑 Owner   : ${s.OWNER_NAME}   
┃ 🤖 Bot Name: ${s.BOT_NAME}  
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

            try {
                if (data && data.lien) {
                    const lien = data.lien;
                    if (lien.match(/\.(mp4|gif)$/i)) {
                        await zk.sendMessage(dest, {
                            video: { url: lien },
                            caption: aliveMsg,
                            ...newsletterContext
                        }, { quoted: ms });
                    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                        await zk.sendMessage(dest, {
                            image: { url: lien },
                            caption: aliveMsg,
                            ...newsletterContext
                        }, { quoted: ms });
                    } else {
                        await sendAliveImage(zk, dest, ms, aliveMsg, repondre);
                    }
                } else {
                    await sendAliveImage(zk, dest, ms, aliveMsg, repondre);
                }
            } catch (e) {
                console.error("Error:", e);
                repondre(`❌ Failed to show Alive Message: ${e.message}`);
            }
        } else {
            if (!superUser) {
                repondre("❌ Only the owner can update Alive message.");
                return;
            }

            const [texte, tlien] = arg.join(' ').split(';');
            await addOrUpdateDataInAlive(texte, tlien);
            repondre(`✅ Alive message updated successfully!`);
        }
    }
);
