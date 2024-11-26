const fs = require('fs');
const path = require('path');

function viderDossier(folderPath) {
    if (fs.existsSync(folderPath)) {
        console.log(`Vider le dossier : ${folderPath}`);
        fs.readdirSync(folderPath).forEach(file => {
            const filePath = path.join(folderPath, file);
            console.log(`Traitement : ${filePath}`);

            if (fs.lstatSync(filePath).isDirectory()) {
                console.log(`C'est un dossier, appel récursif sur : ${filePath}`);
                viderDossier(filePath);
                fs.rmdirSync(filePath);
                console.log(`Dossier supprimé : ${filePath}`);
            } else {
                console.log(`C'est un fichier, suppression : ${filePath}`);
                fs.unlinkSync(filePath);
            }
        });
    }
}

export {
    viderDossier as viderDossier
}