// Commande ping
function ping() {
    console.log('Pong!');
}

// Commande papaye
function papaye() {
    console.log('Tu m\'as trouvé');
}

// Exposer ces fonctions dans l'objet global `window` pour pouvoir les appeler depuis la console de devTools
window.ping = ping;
window.papaye = papaye;
