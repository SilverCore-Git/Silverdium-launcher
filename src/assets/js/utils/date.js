
class Date {
    fDate() {
        const now = new Date();
        let day = String(now.getDate()).padStart(2, '0'); // Jour
        let month = String(now.getMonth() + 1).padStart(2, '0'); // Mois (les mois commencent à 0)
        let year = now.getFullYear(); // Année

        let hours = String(now.getHours()).padStart(2, '0'); // Heures
        let minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes
        let seconds = String(now.getSeconds()).padStart(2, '0'); // Secondes

        let date = (`${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`);
    }
}
export default Date;