// Fonction pour afficher la popup
function afficherPopup() {
    // Création de l'élément div pour la popup
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '9999';
    popup.style.width = '300px';
    popup.style.display = 'none';  // Masqué par défaut

    // Création de l'élément pour fermer la popup (X)
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function() {
        fermerPopup(popup);
    };
    popup.appendChild(closeBtn);

    // Titre de la popup
    const titre = document.createElement('h3');
    titre.textContent = 'Entrez votre commande';
    popup.appendChild(titre);

    // Zone de texte pour entrer la commande
    const inputCommande = document.createElement('input');
    inputCommande.type = 'text';
    inputCommande.id = 'commande';
    inputCommande.placeholder = 'Commande...';
    inputCommande.style.width = '100%';
    inputCommande.style.padding = '10px';
    inputCommande.style.margin = '10px 0';
    inputCommande.style.border = '1px solid #ccc';
    popup.appendChild(inputCommande);

    // Bouton Entrer pour soumettre la commande
    const btnEntrer = document.createElement('button');
    btnEntrer.textContent = 'Entrer';
    btnEntrer.style.width = '100%';
    btnEntrer.style.padding = '10px';
    btnEntrer.style.backgroundColor = '#4CAF50';
    btnEntrer.style.color = 'white';
    btnEntrer.style.border = 'none';
    btnEntrer.style.cursor = 'pointer';
    btnEntrer.onclick = function() {
        soumettreCommande(inputCommande.value, popup);
    };
    popup.appendChild(btnEntrer);

    // Ajout de la popup au body du document
    document.body.appendChild(popup);

    // Affichage de la popup
    popup.style.display = 'block';
}

// Fonction pour fermer la popup
function fermerPopup(popup) {
    popup.style.display = 'none';
    document.body.removeChild(popup);
}

// Fonction pour soumettre la commande
function soumettreCommande(commande, popup) {
    if (commande) {
        alert("Commande soumise : " + commande);
    } else {
        alert("Veuillez entrer une commande.");
    }
    fermerPopup(popup); // Ferme la popup après soumission
}

export default {afficherPopup, fermerPopup, soumettreCommande};