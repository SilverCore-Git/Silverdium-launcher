/**
 * @author Silverdium
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0
 */
import { config, database, logger, changePanel, appdata, setStatus, pkg, popup } from '../utils.js';

const { Launch } = require('minecraft-java-core');
const { shell, ipcRenderer } = require('electron');

class Home {
    static id = "home";

    async init(config) {
        this.config = config;
        this.db = new database();
        this.news();
        this.socialLick();
        this.instancesSelect();
        document.querySelector('.settings-btn').addEventListener('click', e => changePanel('settings'));
    }

    async news() {
        let newsElement = document.querySelector('.news-list');
        let news = await config.getNews().catch(() => false);
        if (news) {
            if (!news.length) {
                this.addNewsBlock(newsElement, "Aucune news n'est actuellement disponible.", "Vous pourrez suivre ici toutes les news relatives au serveur.");
            } else {
                for (let News of news) {
                    let date = this.getdate(News.publish_date);
                    this.addNewsBlock(newsElement, News.title, News.content.replace(/\n/g, '</br>'), date);
                }
            }
        } else {
            this.addNewsBlock(newsElement, "Error.", "Impossible de contacter le serveur des news. {ERREUR-srv17}.", { day: 1, month: "Janvier" });
        }
    }

    addNewsBlock(container, title, content, date = { day: 1, month: "Janvier" }) {
        let blockNews = document.createElement('div');
        blockNews.classList.add('news-block');
        blockNews.innerHTML = `
            <div class="news-header">
                <img class="server-status-icon" src="assets/images/icon.png">
                <div class="header-text">
                    <div class="title">${title}</div>
                </div>
                <div class="date">
                    <div class="day">${date.day}</div>
                    <div class="month">${date.month}</div>
                </div>
            </div>
            <div class="news-content">
                <div class="bbWrapper">
                    <p>${content}</p>
                </div>
            </div>
        `;
        container.appendChild(blockNews);
    }

    socialLick() {
        let socials = document.querySelectorAll('.social-block');

        socials.forEach(social => {
            social.addEventListener('click', e => {
                shell.openExternal(e.target.dataset.url);
            });
        });
    }

    async instancesSelect() {
        let configClient = await this.db.readData('configClient');
        let auth = await this.db.readData('accounts', configClient.account_selected);
        let instancesList = await config.getInstanceList();
        let instanceSelect = instancesList.find(i => i.name == configClient?.instance_selct) ? configClient?.instance_selct : null;

        let instanceBTN = document.querySelector('.play-instance');
        let instancePopup = document.querySelector('.instance-popup');
        let instancesListPopup = document.querySelector('.instances-List');
        let instanceCloseBTN = document.querySelector('.close-popup');

        if (instancesList.length === 1) {
            document.querySelector('.instance-select').style.display = 'none';
            instanceBTN.style.paddingRight = '0';
        }

        if (!instanceSelect) {
            let newInstanceSelect = instancesList.find(i => !i.whitelistActive);
            configClient.instance_selct = newInstanceSelect.name;
            instanceSelect = newInstanceSelect.name;
            await this.db.updateData('configClient', configClient);
        }

        for (let instance of instancesList) {
            if (instance.whitelistActive) {
                let whitelist = instance.whitelist.find(whitelist => whitelist == auth?.name);
                if (whitelist !== auth?.name) {
                    if (instance.name == instanceSelect) {
                        let newInstanceSelect = instancesList.find(i => !i.whitelistActive);
                        configClient.instance_selct = newInstanceSelect.name;
                        instanceSelect = newInstanceSelect.name;
                        setStatus(newInstanceSelect.status);
                        await this.db.updateData('configClient', configClient);
                    }
                }
            } else console.log(`Initializing instance ${instance.name}...`);
            if (instance.name == instanceSelect) setStatus(instance.status);
        }

        instancePopup.addEventListener('click', async e => {
            let configClient = await this.db.readData('configClient');

            if (e.target.classList.contains('instance-elements')) {
                let newInstanceSelect = e.target.id;
                let activeInstanceSelect = document.querySelector('.active-instance');

                if (activeInstanceSelect) activeInstanceSelect.classList.toggle('active-instance');
                e.target.classList.add('active-instance');

                configClient.instance_selct = newInstanceSelect;
                await this.db.updateData('configClient', configClient);
                instanceSelect = instancesList.filter(i => i.name == newInstanceSelect);
                instancePopup.style.display = 'none';
                let instance = await config.getInstanceList();
                let options = instance.find(i => i.name == configClient.instance_selct);
                await setStatus(options.status);
            }
        });

        instanceBTN.addEventListener('click', async e => {
            let configClient = await this.db.readData('configClient');
            let instanceSelect = configClient.instance_selct;
            let auth = await this.db.readData('accounts', configClient.account_selected);

            if (e.target.classList.contains('instance-select')) {
                instancesListPopup.innerHTML = '';
                for (let instance of instancesList) {
                    let isActive = instance.name == instanceSelect ? 'active-instance' : '';
                    let isWhitelisted = instance.whitelistActive && instance.whitelist.includes(auth?.name);
                    if (!instance.whitelistActive || isWhitelisted) {
                        instancesListPopup.innerHTML += `<div id="${instance.name}" class="instance-elements ${isActive}">${instance.name}</div>`;
                    }
                }

                instancePopup.style.display = 'flex';
            }

            if (!e.target.classList.contains('instance-select')) this.startGame();
        });

        instanceCloseBTN.addEventListener('click', () => instancePopup.style.display = 'none');
    }

    async startGame() {
        let launch = new Launch();
        let configClient = await this.db.readData('configClient');
        let instance = await config.getInstanceList();
        let authenticator = await this.db.readData('accounts', configClient.account_selected);
        let options = instance.find(i => i.name === configClient.instance_selct);
    
        let playInstanceBTN = document.querySelector('.play-instance');
        let infoStartingBOX = document.querySelector('.info-starting-game');
        let infoStarting = document.querySelector(".info-starting-game-text");
        let progressBar = document.querySelector('.progress-bar');
    
        let opt = {
            url: options.url,
            authenticator: authenticator,
            timeout: 10000,
            path: `${await appdata()}/${process.platform === 'darwin' ? this.config.dataDirectory : `.${this.config.dataDirectory}`}`,
            instance: options.name,
            version: options.loader.minecraft_version,
            detached: configClient.launcher_config.closeLauncher === "close-all" ? false : true,
            downloadFileMultiple: configClient.launcher_config.download_multi,
            intelEnabledMac: configClient.launcher_config.intelEnabledMac,
            loader: {
                type: options.loader.loader_type,
                build: options.loader.loader_version,
                enable: options.loader.loader_type !== 'none'
            },
            verify: options.verify,
            ignored: [...options.ignored],
            javaPath: configClient.java_config.java_path,
            screen: {
                width: configClient.game_config.screen_size.width,
                height: configClient.game_config.screen_size.height
            },
            memory: {
                min: `${configClient.java_config.java_memory.min * 1024}M`,
                max: `${configClient.java_config.java_memory.max * 1024}M`
            }
        };
    
        launch.Launch(opt);
    
        playInstanceBTN.style.display = "none";
        infoStartingBOX.style.display = "block";
        progressBar.style.display = "block"; // Utiliser "block" au lieu de "" pour être explicite
        ipcRenderer.send('main-window-progress-load');
    
        launch.on('extract', extract => {
            ipcRenderer.send('main-window-progress-load');
            console.log(extract);
        });
    
        launch.on('progress', (progress, size) => {
            infoStarting.innerHTML = `Téléchargement ${((progress / size) * 100).toFixed(0)}%`;
            ipcRenderer.send('main-window-progress', { progress, size });
            progressBar.value = progress;
            progressBar.max = size;
        });
    
        launch.on('check', (progress, size) => {
            infoStarting.innerHTML = `Vérification ${((progress / size) * 100).toFixed(0)}%`;
            ipcRenderer.send('main-window-progress', { progress, size });
            progressBar.value = progress;
            progressBar.max = size;
        });
    
        launch.on('estimated', (time) => {
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time - hours * 3600) / 60);
            let seconds = Math.floor(time - hours * 3600 - minutes * 60);
            console.log(`${hours}h ${minutes}m ${seconds}s`);
        });
    
        launch.on('speed', (speed) => {
            console.log(`${(speed / 1067008).toFixed(2)} Mb/s`);
        });
    
        launch.on('patch', patch => {
            console.log(patch);
            ipcRenderer.send('main-window-progress-load');
            infoStarting.innerHTML = "Patch en cours...";
        });
    
        launch.on('data', (e) => {
            progressBar.style.display = "none";
            if (configClient.launcher_config.closeLauncher === 'close-launcher') {
                ipcRenderer.send("main-window-hide");
            }
            new logger('Minecraft', '#36b030');
            ipcRenderer.send('main-window-progress-load');
            infoStarting.innerHTML = "Démarrage en cours...";
            console.log(e);
        });
    
        launch.on('close', code => {
            if (configClient.launcher_config.closeLauncher === 'close-launcher') {
                ipcRenderer.send("main-window-show");
            }
            ipcRenderer.send('main-window-progress-reset');
            infoStartingBOX.style.display = "none";
            playInstanceBTN.style.display = "flex";
            infoStarting.innerHTML = "Vérification";
            new logger(pkg.name, '#7289da');
            console.log('Close');
        });
    
        launch.on('error', err => {
            let popupError = new popup();
    
            popupError.openPopup({
                title: 'Erreur',
                content: err.error,
                color: 'red',
                options: true
            });
    
            if (configClient.launcher_config.closeLauncher === 'close-launcher') {
                ipcRenderer.send("main-window-show");
            }
            ipcRenderer.send('main-window-progress-reset');
            infoStartingBOX.style.display = "none";
            playInstanceBTN.style.display = "flex";
            infoStarting.innerHTML = "Vérification";
            new logger(pkg.name, '#7289da');
            console.log(err);
        });
    }
    
    getdate(e) {
        let date = new Date(e)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let allMonth = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        return { year: year, month: allMonth[month - 1], day: day }
    }
}
export default Home;