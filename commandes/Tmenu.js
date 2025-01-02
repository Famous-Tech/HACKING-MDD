const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "tmenu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");
    const categories = {};
    
    // Configuration du mode
    const mode = (s.MODE).toLowerCase() === "oui" ? "public" : "privé";

    // Organisation des commandes par catégorie
    cm.map((com) => {
        if (!categories[com.categorie]) {
            categories[com.categorie] = [];
        }
        categories[com.categorie].push(com.nomCom);
    });

    // Configuration de l'heure et de la date
    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // En-tête du bot avec style amélioré
    const header = `
╔══════《 ${s.BOT} 》══════⊱
║
╟❀ *INFORMATIONS DU BOT* ❀
║
╟➣ 👑 *Propriétaire* : ${s.NOM_OWNER}
╟➣ 🌟 *Utilisateur* : ${nomAuteurMessage}
╟➣ 📅 *Date* : ${date}
╟➣ ⏰ *Heure* : ${temps}
╟➣ ⚡ *Préfixe* : ${s.PREFIXE}
╟➣ 🌐 *Mode* : ${mode}
╟➣ 📊 *Commandes* : ${cm.length}
╟➣ 💻 *RAM* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
╟➣ 🔧 *Système* : ${os.platform()}
║
╟❀ *DÉVELOPPEUR* : THOMAS
║
╚════════════════════⊱

${readmore}`;

    // Corps du menu avec style amélioré
    let menuContent = `
╔══❀ *MENU PRINCIPAL* ❀═══⊱
║`;

    // Trier les catégories par ordre alphabétique
    const sortedCategories = Object.keys(categories).sort();

    for (const categorie of sortedCategories) {
        const emoji = getCategoryEmoji(categorie);
        menuContent += `
║
╟══❑ ${emoji} *${categorie.toUpperCase()}* ❑══⊱`;
        
        for (const cmd of categories[categorie]) {
            menuContent += `
╟➣ ${cmd}`;
        }
        
        menuContent += `
║`;
    }

    menuContent += `
║
╚══════════════════⊱

┏━━━━━━━━━━━━━━━━━┓
┃  ⭐ HACKING-MD ⭐  ┃
┃    VERSION ${s.VERSION || "LATEST"}   ┃
┃ By Thomas Tech 2024 ┃
┗━━━━━━━━━━━━━━━━━┛`;

    // Configuration des boutons
    const buttons = [
        { buttonId: `${prefixe}ping`, buttonText: { displayText: '🔄 PING' }, type: 1 },
        { buttonId: `${prefixe}aide`, buttonText: { displayText: '❓ AIDE' }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 }
    ];

    // Template du message avec boutons
    const templateMessage = {
        image: { url: mybotpic() },
        caption: header + menuContent,
        footer: "© 2024 Thomas Tech - Tous droits réservés",
        buttons: buttons,
        headerType: 4
    };

    // Gestion de l'envoi du message avec média et boutons
    try {
        await zk.sendMessage(dest, templateMessage, { quoted: ms });
    } catch (error) {
        console.error("⚠️ Erreur menu:", error);
        // Si l'envoi avec boutons échoue, on revient à l'envoi classique
        const lien = mybotpic();
        try {
            if (lien.match(/\.(mp4|gif)$/i)) {
                await zk.sendMessage(dest, {
                    video: { url: lien },
                    caption: header + menuContent,
                    footer: "© 2024 Thomas Tech - Tous droits réservés",
                    gifPlayback: true
                }, { quoted: ms });
            } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                await zk.sendMessage(dest, {
                    image: { url: lien },
                    caption: header + menuContent,
                    footer: "© 2024 Thomas Tech - Tous droits réservés"
                }, { quoted: ms });
            } else {
                await repondre(header + menuContent);
            }
        } catch (fallbackError) {
            await repondre("❌ Une erreur est survenue lors de l'affichage du menu.");
        }
    }
});

// Fonction pour attribuer des émojis aux catégories
function getCategoryEmoji(category) {
    const emojis = {
        'general': '🎯',
        'owner': '👑',
        'groupe': '👥',
        'fun': '🎮',
        'jeux': '🎲',
        'téléchargement': '📥',
        'recherche': '🔍',
        'outils': '🛠️',
        'admin': '⚡',
        'anime': '🎭',
        'nsfw': '🔞',
        'musique': '🎵',
        'conversion': '🔄',
        'sticker': '🎨',
        'utilitaire': '🔧',
        'modération': '🛡️',
        'économie': '💰',
        'info': 'ℹ️',
        'divers': '📦'
    };
    
    return emojis[category.toLowerCase()] || '📱';
}
