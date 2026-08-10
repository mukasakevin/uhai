/**
 * seed.js — Source unique et centralisée des données initiales des causes/objectifs.
 * Ce fichier est la SEULE source de vérité pour les données de départ.
 * Utilisé par : init-db.js (initialisation SQLite) et src/db.js (fallback runtime).
 */

const CAUSES = [
    {
        id: 1,
        title: "1. Guérison du traumatisme à base communautaire",
        excerpt: "Plaidoyer pour limiter les effets de la transmission intergénérationnelle du traumatisme et de la violence. Participation active du plus grand nombre, avec une attention particulière aux personnes les plus stigmatisées, pour consolider leur réinsertion au sein de la société, par la compréhension et l'apprentissage des méthodes de base pour répondre au traumatisme.",
        image: "images/trauma_healing.jpg"
    },
    {
        id: 2,
        title: "2. Transformation et résolution des conflits",
        excerpt: "Amener la communauté à développer des mécanismes non violents de résolution des conflits, et renforcer les capacités des structures locales œuvrant dans la pacification, en encourageant la culture de l'éducation à la paix dans la communauté à la base.",
        image: "images/conflict_resolution.jpg"
    },
    {
        id: 3,
        title: "3. Lutte contre les violences basées sur le genre",
        excerpt: "Lutter contre les normes sociales qui défavorisent la femme, promouvoir la participation de la femme au sein de la société et sensibiliser la communauté à la lutte contre les violences sexuelles et basées sur le genre.",
        image: "images/gender_violence_fight.png"
    },
    {
        id: 4,
        title: "4. Santé de la reproduction",
        excerpt: "À travers une communication étendue, améliorer les conditions de vie de la femme et de l'homme en les incitant à utiliser les méthodes appropriées afin de jouir d'une sexualité saine, dans l'intérêt de la famille.",
        image: "images/reproductive_health.png"
    },
    {
        id: 5,
        title: "5. Sécurité alimentaire",
        excerpt: "À travers la sensibilisation et la formation, accompagner la communauté à exploiter les champs pour accroître la productivité, en vue de combattre la faim, par la disponibilité, la satisfaction et l'utilisation alimentaire saine et équilibrée.",
        image: "images/food_security.jpg"
    },
    {
        id: 6,
        title: "6. Environnement",
        excerpt: "Sensibiliser la population à la gestion des déchets et encourager le reboisement des zones menacées par la déforestation et l'érosion, en appelant la communauté à perpétuer la culture de planter les arbres en milieux urbains et ruraux.",
        image: "images/environment.png"
    },
    {
        id: 7,
        title: "7. Protection de l'enfance",
        excerpt: "Prévenir et lutter contre la violence, l'exploitation et les mauvais traitements infligés aux enfants, y compris l'exploitation sexuelle à des fins commerciales, la traite et le travail des enfants, ainsi que les pratiques traditionnelles préjudiciables comme les mutilations génitales féminines / l'excision et le mariage des enfants.",
        image: "images/child_protection.jpg"
    }
];

module.exports = CAUSES;
