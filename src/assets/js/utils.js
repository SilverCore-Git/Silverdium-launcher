/**
 * @author Silverdium
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0
 */
const { config, database, logger, changePanel, appdata, setStatus, pkg, popup } = require('../utils.js');
const { Launch } = require('minecraft-java-core');
const { shell, ipcRenderer } = require('electron');

class Home {
    static id = 'home';

    async init(config) {
        this.config = config;
        this.db = new database();
        this.news();
        this.socialLink();
        this.instancesSelect();
        document.querySelector('.settings-btn').addEventListener('click', () => changePanel('settings'));
    }

    async news() {
        const newsElement = document.querySelector('.news-list');
        const news = await config.getNews().catch(() => false);
        if (news && news.length) {
            news.forEach(News => {
                const date = this.getDate(News.publish_date);
                const blockNews = document.createElement('div');
                blockNews.className = 'news-block';
                blockNews.innerHTML = `
                    <div class="news-header">
                        <img class="server-status-icon" src="assets/images/icon.png">
                        <div class="header-text">
                            <div class="title">${News.title}</div>
                        </div>
                        <div class="date">
                            <div class="day">${date.day}</div>
                            <div class="month">${date.month}</div>
                        </div>
                    </div>
                    <div class="news-content">
                        <div class="bbWrapper">
                            <p>${News.content.replace(/\n/g, '</br>')}</p>
                            <p class="news-author">Auteur - <span>${News.author}</span></p>
                        </div>
                    </div>`;
                newsElement.appendChild(blockNews);
            });
        } else {
            newsElement.innerHTML = `<div class="news-block"><p>Impossible de charger les news.</p></div>`;
        }
    }

    socialLink() {
        document.querySelectorAll('.social-block').forEach(social => {
            social.addEventListener('click', e => shell.openExternal(e.target.dataset.url));
        });
    }

    async instancesSelect() {
        const configClient = await this.db.readData('configClient');
        const auth = await this.db.readData('accounts', configClient.account_selected);
        const instancesList = await config.getInstanceList();
        let instanceSelect = configClient.instance_select || instancesList.find(i => !i.whitelistActive)?.name;

        const instanceBTN = document.querySelector('.play-instance');
        const instancePopup = document.querySelector('.instance-popup');
        const instancesListPopup = document.querySelector('.instances-List');

        instanceBTN.addEventListener('click', async e => {
            if (e.target.classList.contains('instance-select')) {
                instancesListPopup.innerHTML = '';
                for (const instance of instancesList) {
                    if (!instance.whitelistActive || instance.whitelist.includes(auth?.name)) {
                        instancesListPopup.innerHTML += `
                            <div id="${instance.name}" class="instance-elements ${instance.name === instanceSelect ? 'active-instance' : ''}">
                                ${instance.name}
                            </div>`;
                    }
                }
                instancePopup.style.display = 'flex';
            } else {
                this.startGame();
            }
        });

        instancePopup.addEventListener('click', async e => {
            if (e.target.classList.contains('instance-elements')) {
                const newInstanceSelect = e.target.id;
                configClient.instance_select = newInstanceSelect;
                await this.db.updateData('configClient', configClient);
                instanceSelect = newInstanceSelect;
                instancePopup.style.display = 'none';
                await this.instancesSelect();
            }
        });

        const selectedInstance = instancesList.find(i => i.name === instanceSelect);
        if (selectedInstance) {
            document.querySelector('.play-instance-name').textContent = selectedInstance.name;
            setStatus(selectedInstance);
        }
    }

    async startGame() {
        const instances = await config.getInstanceList();
        const selectedInstance = instances.find(i => i.name === configClient.instance_select);

        if (!selectedInstance || !selectedInstance.url) {
            return popup("Erreur : l'URL de l'instance sélectionnée est invalide ou non trouvée.");
        }

        const auth = await this.db.readData('accounts', configClient.account_selected);
        const launcher = new Launch();

        try {
            await launcher.launch({
                url: selectedInstance.url,
                authenticator: auth,
                launcher_name: pkg.name,
                launcher_version: pkg.version
            });
        } catch (e) {
            console.error("Erreur lors du lancement :", e);
            popup("Erreur : Impossible de lancer le jeu.");
        }
    }
}

module.exports = Home;
