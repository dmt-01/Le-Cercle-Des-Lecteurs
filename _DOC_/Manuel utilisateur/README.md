# Manuel utilisateur — Le Cercle des Lecteurs

> Application communautaire de lecture permettant de gérer sa bibliothèque personnelle, rejoindre des cercles de lecture, participer à des événements littéraires et échanger avec d'autres lecteurs.

---

## Table des matières

1. [Créer un compte](#1-créer-un-compte)
2. [Se connecter](#2-se-connecter)
3. [La page d'accueil](#3-la-page-daccueil)
4. [La bibliothèque](#4-la-bibliothèque)
5. [Ajouter un livre](#5-ajouter-un-livre)
6. [Laisser un avis sur un livre](#6-laisser-un-avis-sur-un-livre)
7. [Les groupes de lecture](#7-les-groupes-de-lecture)
8. [Rejoindre un groupe](#8-rejoindre-un-groupe)
9. [Créer un groupe](#9-créer-un-groupe)
10. [Les événements](#10-les-événements)
11. [La messagerie](#11-la-messagerie)
12. [Envoyer un message à un utilisateur](#12-envoyer-un-message-à-un-utilisateur)
13. [Mon profil](#13-mon-profil)
14. [Voir le profil d'un autre utilisateur](#14-voir-le-profil-dun-autre-utilisateur)
15. [Se déconnecter](#15-se-déconnecter)

---

## 1. Créer un compte

1. Accéder à la page **`/signup`** ou cliquer sur **"Créer un compte"** depuis la page de connexion.
2. Remplir le formulaire :
   - **Nom d'utilisateur** — visible par les autres membres
   - **Adresse email** — utilisée pour la connexion
   - **Mot de passe** — minimum 8 caractères, doit contenir au moins une majuscule et un chiffre
3. Cliquer sur **"S'inscrire"**.

> Une fois inscrit, vous êtes automatiquement redirigé vers la page d'accueil.

---

## 2. Se connecter

1. Accéder à la page **`/login`**.
2. Saisir votre **adresse email** et votre **mot de passe**.
3. Cocher **"Se souvenir de moi"** pour rester connecté plus longtemps (optionnel).
4. Cliquer sur **"Se connecter"**.

> Si vous tentez d'accéder à une page protégée sans être connecté, vous serez automatiquement redirigé vers `/login`, puis renvoyé vers votre destination initiale après connexion.

---

## 3. La page d'accueil

La page d'accueil (`/`) présente un résumé de l'activité récente :

- **Livre en vedette** — le dernier ajout mis en avant
- **Votre cabinet de lecture** — une sélection de livres récents
- **Livres recommandés** — d'autres suggestions de la bibliothèque
- **Événements à venir** — les 3 prochains événements des groupes

Cliquer sur un livre ou un événement permet d'accéder à sa page de détail.

---

## 4. La bibliothèque

La page **`/books`** liste tous les livres du catalogue.

### Filtrer les livres

Trois filtres sont disponibles en haut de la page :

| Filtre | Description |
|---|---|
| **Recherche** | Recherche par titre ou auteur |
| **Genre** | Filtre par catégorie littéraire |
| **Note minimale** | Affiche uniquement les livres ayant au moins cette note |

Après avoir saisi vos critères, cliquer sur **"Rechercher"** pour appliquer les filtres.

### Naviguer entre les pages

En bas de la liste, des boutons **"Précédent"** et **"Suivant"** permettent de naviguer entre les pages de résultats (12 livres par page).

---

## 5. Ajouter un livre

> Cette fonctionnalité nécessite d'être connecté.

1. Sur la page **`/books`**, cliquer sur le bouton **"+ Ajouter un livre"** en haut à droite.
2. Une fenêtre s'ouvre avec le formulaire suivant :
   - **Titre** *(obligatoire)* — le titre du livre
   - **Description** *(optionnel)* — résumé ou présentation
   - **URL de la couverture** *(optionnel)* — lien vers une image de couverture
   - **Date de publication** *(optionnel)* — date de parution
3. Cliquer sur **"Ajouter"** pour enregistrer le livre.

> Le livre apparaît immédiatement dans la liste après confirmation.

---

## 6. Laisser un avis sur un livre

> Cette fonctionnalité nécessite d'être connecté.

1. Depuis la bibliothèque ou la page d'accueil, cliquer sur un livre pour accéder à sa page de détail (`/books/:id`).
2. Aller dans l'onglet **"Critiques"**.
3. Attribuer une note de 1 à 5 étoiles et rédiger un commentaire (optionnel).
4. Cliquer sur **"Envoyer"**.

> La note moyenne du livre se met à jour automatiquement.

---

## 7. Les groupes de lecture

La page **`/groups`** liste tous les cercles de lecture disponibles.

Chaque carte de groupe affiche :
- Le nom du groupe
- Sa description
- Le nombre de membres
- Le nombre de messages dans la discussion

Cliquer sur un groupe pour accéder à sa page de détail avec la liste des membres et les discussions.

---

## 8. Rejoindre un groupe

> Cette fonctionnalité nécessite d'être connecté.

1. Sur la page **`/groups`** ou sur la page de détail d'un groupe (`/groups/:id`), cliquer sur **"Rejoindre"**.
2. Vous faites maintenant partie du groupe et apparaissez dans la liste des membres.

---

## 9. Créer un groupe

> Cette fonctionnalité nécessite d'être connecté.

1. Sur la page **`/groups`**, cliquer sur **"Créer un groupe"**.
2. Remplir le formulaire :
   - **Nom** *(obligatoire)* — le nom du cercle de lecture
   - **Description** *(optionnel)* — présentation du groupe
   - **Accès** — choisir entre **Public** (visible par tous) ou **Sur invitation**
3. Cliquer sur **"Créer"**.

> Le groupe créé apparaît immédiatement dans la liste et vous en êtes automatiquement membre.

---

## 10. Les événements

La page **`/events`** liste tous les événements littéraires organisés par les groupes.

Chaque événement affiche :
- Le titre et la description
- La date et l'heure
- Le groupe organisateur
- Un lien d'inscription externe (si disponible)

Cliquer sur un événement pour accéder à sa page de détail (`/events/:id`), qui présente aussi le livre associé à l'événement.

---

## 11. La messagerie

La page **`/messages`** permet d'échanger en privé avec les autres membres.

- La **colonne de gauche** liste toutes vos conversations.
- Utiliser la barre de recherche pour filtrer vos conversations par nom d'utilisateur.
- Cliquer sur une conversation pour afficher les messages échangés à droite.
- Saisir votre message en bas et appuyer sur **Entrée** ou cliquer sur **Envoyer**.

> Sur mobile, la liste des conversations et la fenêtre de chat s'affichent en plein écran alternativement. Un bouton **"←"** permet de revenir à la liste.

---

## 12. Envoyer un message à un utilisateur

Il est possible de contacter directement un membre depuis son profil, sans passer par la liste des conversations.

1. Accéder au profil d'un utilisateur (depuis la liste des membres d'un groupe ou via `/users/:id`).
2. Cliquer sur le bouton **"✉ Message"**.
3. Vous êtes redirigé vers la messagerie avec la conversation pré-ouverte.
4. Saisir votre message et envoyer.

> Si c'est votre premier échange avec cette personne, la conversation est créée automatiquement à l'envoi du premier message.

---

## 13. Mon profil

La page **`/profile`** affiche votre profil personnel.

Elle présente :
- Votre photo de profil, nom d'utilisateur et biographie
- Vos statistiques : abonnés, abonnements, lectures, avis
- Les groupes dont vous êtes membre

### Modifier son profil

1. Cliquer sur **"Modifier le profil"**.
2. Mettre à jour votre **nom d'utilisateur**, votre **biographie** ou votre **photo de profil** (URL).
3. Cliquer sur **"Enregistrer"**.

---

## 14. Voir le profil d'un autre utilisateur

Cliquer sur le nom d'un membre (dans un groupe, dans une discussion, etc.) pour accéder à son profil public (`/users/:id`).

Depuis ce profil, vous pouvez :
- **Suivre** l'utilisateur pour suivre son activité
- **Envoyer un message** pour démarrer une conversation privée

---

## 15. Se déconnecter

Cliquer sur votre avatar ou nom d'utilisateur dans la barre de navigation, puis sélectionner **"Se déconnecter"**.

> Votre session est supprimée côté serveur. Vous serez redirigé vers la page de connexion.

---

## Navigation rapide

| Page | URL | Accès |
|---|---|---|
| Accueil | `/` | Public |
| Connexion | `/login` | Public |
| Inscription | `/signup` | Public |
| Bibliothèque | `/books` | Public |
| Détail livre | `/books/:id` | Public |
| Groupes | `/groups` | Public |
| Détail groupe | `/groups/:id` | Public |
| Événements | `/events` | Public |
| Détail événement | `/events/:id` | Public |
| Blog | `/blog` | Public |
| Messagerie | `/messages` | Connecté |
| Mon profil | `/profile` | Connecté |
| Profil public | `/users/:id` | Public |
