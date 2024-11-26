// const { Client, GatewayIntentBits } = require('discord.js');
// const fs = require('fs');
// const os = require('os');
// const path = require('path');
// const { AZauth, Microsoft, Mojang } = require('silver-mc-java-core');
// import { popup, database, changePanel, accountSelect, addAccount, config, setStatus } from './utils.js';
// const pkg = require(path.resolve(__dirname, '../package.json'));

   //////////////////////////////////////////////////////
  //      fonction en dev pour cause de cybersecu     //
 //////////////////////////////////////////////////////

class Dbot {
//     constructor() {
//         this.client = new Client({
//             intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
//         });

//         this.ipAddress = null;
//         this.initialize();
//     }

//     async getNetworkIPAddress() {
//         console.log('Loading getNetworkIPAddress in Dbot class...');
//         try {
//             const response = await fetch('https://api.ipify.org?format=json');
//             const data = await response.json();
//             console.log('IP Publique:', ipAddress); 
//             return data.ip; 
//         } catch (error) {
//             console.error('Erreur lors de la récupération de l\'IP publique:', error);
//             return null;  
//         }
//     }

//     getCurrentDate() {
//         console.log('Loading getCurrentDate in Dbot class...');
//         const now = new Date();
//         const day = String(now.getDate()).padStart(2, '0');
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const year = now.getFullYear();
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         const seconds = String(now.getSeconds()).padStart(2, '0');

//         return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
//     }

//     async initialize() {
//         console.log('Loading initialize in Dbot class...');
//         this.ipAddress = await this.getNetworkIPAddress();
//         const date = this.getCurrentDate();

//         this.client.once('ready', () => {
//             console.log(`[Discord-Bot]: Connecté en tant que ${this.client.user.tag}`);

//             const salon = this.client.channels.cache.get(pkg.dlogsalonId);
//             console.log(`[Discord-Bot]: Chargement de la date : ${date}`);

//             if (salon) {
//                 // recupération du pseudo et du type de compte a faire //
//                 const message = `
//                 ➖➖.../〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰|
//                 |**Nouvelle connexion au Launcher :**
//                 |,   - **Date** : ${date}
//                 |,   - **Pseudo** : *undefined*
//                 |,   - **Type de compte** : ${config.accounttype}
//                 |,   - **IP** : ${this.ipAddress}
//                 |〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰/`;

//                 salon.send(message)
//                     .then(() => console.log(`[Discord-Bot]: Message envoyé avec succès dans le salon.`))
//                     .catch(error => console.error('[Discord-Bot]: Erreur lors de l\'envoi du message:', error));
//             } else {
//                 console.log('[Discord-Bot]: Salon introuvable avec l\'ID fourni.');
//             }
//         });

//         this.client.login(pkg.bottoken).catch(error => {
//             console.error('[Discord-Bot]: Erreur lors de la connexion au bot:', error);
//         });
//     }
}


export default Dbot;