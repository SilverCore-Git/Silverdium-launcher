export async function createFile(config) {
    const fs = require('fs');
    const path = require('path');

    // Obtenir le chemin de l'application
    const directori = `./`;
    const filePath = path.join(directori, 'silver-uninst.bat');
    const fileContent = `
@echo off
color b
title Désinstallation de Silverdium-Launcher
echo _
echo _
echo Êtes-vous sûr de vouloir désinstaller Silverdium Launcher ?
echo [oui = continuer | non = fermer la fenêtre]
set /p uninstconf="> "

if /i "%uninstconf%" == "oui" (
    echo Lancement du désinstalleur
) else (
    echo Annulation de la désinstallation
)

echo Fermeture du script
timeout /nobreak /t 1 >nul

`;

    return new Promise((resolve, reject) => {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) return reject(err);

            fs.writeFile(filePath, fileContent.trim(), (err) => {
                if (err) return reject(err);
                console.log(`[UNINST]: Fichier créé avec succès : ${directori}${filePath}`);
                resolve();
            });
        });
    });
}
