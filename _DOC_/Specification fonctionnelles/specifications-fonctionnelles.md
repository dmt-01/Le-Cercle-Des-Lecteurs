# Spécifications fonctionnelles — Le Cercle des Lecteurs

Le Cercle des Lecteurs est une plateforme communautaire de lecture permettant
aux membres de gérer leur bibliothèque personnelle, rejoindre des cercles de
lecture, participer à des événements littéraires et échanger avec d'autres
lecteurs. L'application est accessible à tous en consultation, et requiert
une inscription pour accéder aux fonctionnalités sociales et personnelles.

---

## Acteurs du système

| Rôle | Description |
|---|---|
| **Visiteur** | Utilisateur non connecté. Peut consulter le catalogue, les événements et le blog sans s'inscrire. |
| **Membre** | Utilisateur inscrit et connecté. Accède à toutes les fonctionnalités sociales et personnelles. |
| **Modérateur** | Membre avec droits de modération sur les clubs et le contenu. Hérite des droits du Membre. |
| **Administrateur** | Accès complet à la plateforme. Gère le catalogue, les utilisateurs et les événements. |

---

## User Stories

### Visiteur

| ID | User Story |
|---|---|
| US-01 | En tant que **visiteur**, je veux **voir la page d'accueil** afin de **découvrir la plateforme avant de m'inscrire**. |
| US-02 | En tant que **visiteur**, je veux **créer un compte** afin de **rejoindre la communauté**. |
| US-03 | En tant que **visiteur**, je veux **me connecter avec mon email et mot de passe** afin d'**accéder à mon espace personnel**. |
| US-04 | En tant que **visiteur**, je veux **me connecter via Google ou Apple** afin de **m'authentifier rapidement**. |
| US-05 | En tant que **visiteur**, je veux **parcourir le catalogue de livres** afin de **découvrir la plateforme sans m'inscrire**. |
| US-06 | En tant que **visiteur**, je veux **consulter les événements à venir** afin de **décider si la plateforme m'intéresse**. |

---

### Membre

#### Profil

| ID | User Story |
|---|---|
| US-07 | En tant que **membre**, je veux **modifier mon profil** afin de **personnaliser mon expérience**. |
| US-08 | En tant que **membre**, je veux **choisir mes genres littéraires préférés** afin de **recevoir des recommandations pertinentes**. |
| US-09 | En tant que **membre**, je veux **suivre d'autres membres** afin de **suivre leur activité littéraire**. |
| US-10 | En tant que **membre**, je veux **voir mes badges obtenus** afin de **suivre ma progression sur la plateforme**. |
| US-11 | En tant que **membre**, je veux **supprimer mon compte** afin de **respecter mon droit à l'effacement (RGPD)**. |

#### Livres

| ID | User Story |
|---|---|
| US-12 | En tant que **membre**, je veux **rechercher un livre par titre, auteur ou genre** afin de **trouver rapidement ce que je cherche**. |
| US-13 | En tant que **membre**, je veux **consulter la fiche détaillée d'un livre** afin d'**obtenir toutes les informations avant de le lire**. |
| US-14 | En tant que **membre**, je veux **marquer un livre comme lu** afin de **suivre mon historique de lecture**. |
| US-15 | En tant que **membre**, je veux **ajouter un livre à ma wishlist** afin de **le retrouver facilement plus tard**. |
| US-16 | En tant que **membre**, je veux **noter un livre de 1 à 5 étoiles** afin de **partager mon appréciation**. |
| US-17 | En tant que **membre**, je veux **rédiger une critique d'un livre** afin de **partager mon avis avec la communauté**. |
| US-18 | En tant que **membre**, je veux **liker une critique** afin d'**encourager les membres qui rédigent du contenu**. |
| US-19 | En tant que **membre**, je veux **voir les recommandations personnalisées** afin de **découvrir de nouveaux livres adaptés à mes goûts**. |

#### Clubs de lecture

| ID | User Story |
|---|---|
| US-20 | En tant que **membre**, je veux **créer un club de lecture** afin de **rassembler des lecteurs autour d'un thème commun**. |
| US-21 | En tant que **membre**, je veux **rejoindre un club de lecture** afin de **participer aux discussions communautaires**. |
| US-22 | En tant que **membre**, je veux **quitter un club** afin de **gérer mes participations**. |
| US-23 | En tant que **membre**, je veux **envoyer un message dans un club** afin de **participer aux discussions**. |
| US-24 | En tant que **membre**, je veux **rejoindre une session Zoom depuis le club** afin de **participer aux rencontres virtuelles**. |

#### Messagerie

| ID | User Story |
|---|---|
| US-25 | En tant que **membre**, je veux **envoyer un message privé à un autre membre** afin d'**échanger en dehors des groupes**. |
| US-26 | En tant que **membre**, je veux **voir si mon message a été lu** afin de **savoir si mon interlocuteur a pris connaissance de mon message**. |
| US-27 | En tant que **membre**, je veux **partager un livre dans un message** afin de **recommander une lecture à un ami**. |

#### Événements

| ID | User Story |
|---|---|
| US-28 | En tant que **membre**, je veux **consulter le calendrier des événements** afin de **planifier ma participation**. |
| US-29 | En tant que **membre**, je veux **m'inscrire à un événement** afin de **réserver ma place**. |
| US-30 | En tant que **membre**, je veux **annuler mon inscription à un événement** afin de **libérer ma place si je ne peux pas y assister**. |

#### Blog

| ID | User Story |
|---|---|
| US-31 | En tant que **membre**, je veux **lire les articles du blog** afin de **m'enrichir culturellement**. |
| US-32 | En tant que **membre**, je veux **commenter un article** afin de **partager mon avis**. |
| US-33 | En tant que **membre**, je veux **filtrer les articles par catégorie** afin de **trouver le contenu qui m'intéresse**. |
| US-34 | En tant que **membre**, je veux **m'abonner à la newsletter** afin de **recevoir les derniers articles par email**. |
| US-35 | En tant que **membre**, je veux **partager un article sur les réseaux sociaux** afin de **le recommander à mes proches**. |

#### Divers

| ID | User Story |
|---|---|
| US-36 | En tant que **membre**, je veux **voir mon statut de lecture en cours** afin de **reprendre facilement là où je m'étais arrêté**. |
| US-37 | En tant que **membre**, je veux **exporter mes données personnelles** afin de **respecter mon droit à la portabilité (RGPD)**. |
| US-38 | En tant que **membre**, je veux **recevoir des badges automatiquement** afin d'**être récompensé pour mon engagement**. |
| US-39 | En tant que **membre**, je veux **voir mon nombre de livres lus et terminés** afin de **suivre ma progression**. |
| US-40 | En tant que **membre**, je veux **réinitialiser mon mot de passe** afin de **récupérer l'accès à mon compte**. |

---

### Modérateur

| ID | User Story |
|---|---|
| US-41 | En tant que **modérateur**, je veux **supprimer une critique inappropriée** afin de **maintenir la qualité du contenu**. |
| US-42 | En tant que **modérateur**, je veux **signaler un commentaire de blog** afin de **le soumettre à la révision admin**. |
| US-43 | En tant que **modérateur**, je veux **exclure un membre d'un club** afin de **protéger la communauté**. |
| US-44 | En tant que **modérateur**, je veux **épingler un message dans un club** afin de **mettre en avant les informations importantes**. |

---

### Administrateur

| ID | User Story |
|---|---|
| US-45 | En tant qu'**admin**, je veux **voir les KPIs du tableau de bord** afin de **suivre l'activité de la plateforme**. |
| US-46 | En tant qu'**admin**, je veux **ajouter un livre au catalogue** afin d'**enrichir la bibliothèque**. |
| US-47 | En tant qu'**admin**, je veux **modifier ou supprimer un livre** afin de **maintenir le catalogue à jour**. |
| US-48 | En tant qu'**admin**, je veux **publier un article de blog** afin de **partager du contenu éditorial**. |
| US-49 | En tant qu'**admin**, je veux **créer et gérer des événements** afin d'**animer la communauté**. |
| US-50 | En tant qu'**admin**, je veux **gérer les rôles des utilisateurs** afin de **contrôler les accès à la plateforme**. |
| US-51 | En tant qu'**admin**, je veux **suspendre ou supprimer un compte utilisateur** afin de **sanctionner les comportements inappropriés**. |
| US-52 | En tant qu'**admin**, je veux **voir les collections en vedette** afin de **mettre en avant des sélections thématiques**. |
| US-53 | En tant qu'**admin**, je veux **consulter les logs d'activité** afin de **détecter les comportements suspects**. |
| US-54 | En tant qu'**admin**, je veux **gérer les badges disponibles** afin de **personnaliser le système de récompenses**. |

---

## Récapitulatif

| Rôle | Nombre de user stories |
|---|---|
| Visiteur | 6 |
| Membre | 34 |
| Modérateur | 4 |
| Administrateur | 10 |
| **Total** | **54** |