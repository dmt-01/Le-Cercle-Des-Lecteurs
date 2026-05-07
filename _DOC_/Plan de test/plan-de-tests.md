# Plan de tests fonctionnels — Le Cercle des Lecteurs

Ce document recense les tests fonctionnels réalisés manuellement sur la plateforme "Le Cercle des Lecteurs".
Chaque test couvre un scénario utilisateur réel, du parcours d'authentification jusqu'aux fonctionnalités sociales.
Les tests ont été effectués sur l'environnement de développement local (frontend port 5173, backend port 3000).

---

## 1. Authentification

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T01 | Inscription avec des données valides | Compte créé, cookie httpOnly posé, redirection vers l'accueil | Conforme | ✅ |
| T02 | Inscription avec un email déjà utilisé | Message d'erreur "Utilisateur déjà existant" (409) | Conforme | ✅ |
| T03 | Inscription avec un mot de passe de moins de 12 caractères | Erreur de validation Zod (422) | Conforme | ✅ |
| T04 | Connexion avec des identifiants valides | Cookie rafraîchi, utilisateur redirigé vers l'accueil | Conforme | ✅ |
| T05 | Connexion avec un mauvais mot de passe | Message "Email ou mot de passe incorrect" (401) | Conforme | ✅ |
| T06 | Déconnexion | Cookie supprimé, token supprimé en base, redirection vers la page de connexion | Conforme | ✅ |
| T07 | Refresh du token | Nouveau JWT émis, ancien token remplacé en base (rotation) | Conforme | ✅ |
| T08 | Accès à une route protégée sans être connecté | Réponse 401 "Non authentifié" | Conforme | ✅ |

---

## 2. Livres

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T09 | Affichage de la liste des livres | Liste paginée des livres visible | Conforme | ✅ |
| T10 | Recherche d'un livre par titre | Résultats filtrés correspondant à la recherche | Conforme | ✅ |
| T11 | Filtrage par genre | Seuls les livres du genre sélectionné s'affichent | Conforme | ✅ |
| T12 | Accès à la page détail d'un livre | Informations complètes du livre affichées (titre, auteur, résumé, avis) | Conforme | ✅ |
| T13 | Ajout d'un livre (utilisateur connecté) | Livre créé et visible dans la liste | Conforme | ✅ |
| T14 | Toggle "lu" sur un livre | Statut lu/non lu mis à jour et persisté | Conforme | ✅ |
| T15 | Toggle "like" sur un livre | Compteur de likes mis à jour | Conforme | ✅ |

---

## 3. Wishlist

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T16 | Ajouter un livre à la wishlist | Livre apparaît dans la wishlist de l'utilisateur | Conforme | ✅ |
| T17 | Retirer un livre de la wishlist | Livre supprimé de la wishlist | Conforme | ✅ |
| T18 | Voir sa wishlist | Tous les livres ajoutés sont listés | Conforme | ✅ |

---

## 4. Reviews

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T19 | Laisser un avis sur un livre | Avis enregistré et affiché sur la page du livre | Conforme | ✅ |
| T20 | Modifier son avis | Avis mis à jour avec le nouveau contenu | Conforme | ✅ |
| T21 | Supprimer son avis | Avis retiré de la page du livre | Conforme | ✅ |

---

## 5. Groupes

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T22 | Affichage de la liste des groupes | Tous les groupes publics sont listés | Conforme | ✅ |
| T23 | Accès à la page détail d'un groupe | Membres, description et fil de discussion affichés | Conforme | ✅ |
| T24 | Rejoindre un groupe | Utilisateur ajouté comme membre, accès au fil | Conforme | ✅ |
| T25 | Quitter un groupe | Utilisateur retiré des membres | Conforme | ✅ |
| T26 | Créer un groupe | Groupe créé, utilisateur défini comme administrateur | Conforme | ✅ |
| T27 | Envoyer un message dans un groupe | Message visible dans le fil de discussion du groupe | Conforme | ✅ |

---

## 6. Événements

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T28 | Affichage de la liste des événements | Événements à venir listés avec date et lieu | Conforme | ✅ |
| T29 | Accès à la page détail d'un événement | Description complète et lien d'inscription affiché | Conforme | ✅ |
| T30 | Clic sur le lien d'inscription externe | Redirection vers le site tiers dans un nouvel onglet | Conforme | ✅ |

---

## 7. Blog

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T31 | Affichage de la liste des articles | Articles triés par date de publication décroissante | Conforme | ✅ |
| T32 | Accès à la page détail d'un article | Contenu complet de l'article affiché | Conforme | ✅ |
| T33 | Filtrage par catégorie | Seuls les articles de la catégorie sélectionnée s'affichent | Conforme | ✅ |

---

## 8. Messagerie

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T34 | Affichage de la liste des conversations | Conversations triées par message le plus récent | Conforme | ✅ |
| T35 | Envoyer un message à un contact existant | Message envoyé et affiché dans la conversation | Conforme | ✅ |
| T36 | Initier une conversation depuis le profil d'un utilisateur | Nouvelle conversation créée, redirection vers la messagerie | Conforme | ✅ |

---

## 9. Profil

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T37 | Voir son propre profil | Informations personnelles, livres lus, avis et abonnements affichés | Conforme | ✅ |
| T38 | Modifier son profil (bio, photo) | Modifications enregistrées et visibles immédiatement | Conforme | ✅ |
| T39 | Voir le profil public d'un autre utilisateur | Informations publiques affichées, bouton suivre visible | Conforme | ✅ |
| T40 | Suivre un utilisateur | Compteur d'abonnements mis à jour, bouton passe à "Ne plus suivre" | Conforme | ✅ |
| T41 | Ne plus suivre un utilisateur | Abonnement supprimé, bouton repasse à "Suivre" | Conforme | ✅ |

---

## 10. Sécurité

| ID  | Scénario | Résultat attendu | Résultat obtenu | Statut |
|-----|----------|------------------|-----------------|--------|
| T42 | Appel API sur une route protégée sans cookie | Réponse 401 "Non authentifié" | Conforme | ✅ |
| T43 | Appel API avec un token JWT falsifié | Réponse 401 "Token invalide ou expiré" | Conforme | ✅ |
| T44 | 11 tentatives de connexion consécutives depuis la même IP | Blocage à la 11e tentative, message "Trop de tentatives, veuillez réessayer dans une minute." (429) | Conforme | ✅ |
| T45 | Inscription avec un mot de passe de 6 caractères | Erreur de validation (422), inscription refusée | Conforme | ✅ |
| T46 | Vérification que le hash du mot de passe n'est pas retourné par l'API | Le champ `password_hash` est absent de toutes les réponses JSON | Conforme | ✅ |