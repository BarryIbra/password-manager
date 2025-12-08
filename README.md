# password-manager

## Description

Cette application est un **gestionnaire de mots de passe** de bureau développé avec **Electron**, permettant aux utilisateurs de stocker, gérer et sécuriser leurs mots de passe localement. Les mots de passe sont **chiffrés avec AES‑256‑GCM** pour assurer leur confidentialité, tandis que les mots de passe des utilisateurs sont sécurisés avec **bcrypt**.

L'application prend en charge :

* Authentification multi-utilisateurs
* CRUD complet pour les mots de passe (ajouter, lire, modifier, supprimer)
* Affichage sécurisé des mots de passe avec un mode **“appuyer pour révéler”**
* Persistance locale des données avec **PostgreSQL**

---

## Contexte

Avec la multiplication des services en ligne, gérer ses mots de passe de manière sécurisée est devenu indispensable. Cette application offre :

* Une **solution locale**, sans dépendance à un cloud externe, pour protéger la confidentialité des données.
* Un **chiffrement robuste** grâce à AES‑256‑GCM et une bonne gestion des clés.
* Une interface simple et réactive pour gérer facilement les mots de passe.

L'objectif est de fournir un outil open-source, sécurisé et facilement extensible pour la gestion quotidienne des mots de passe.

---

## Fonctionnalités

* Authentification sécurisée (login / registration)
* Gestion multi-utilisateurs
* Ajouter, modifier, supprimer des mots de passe
* Affichage sécurisé des mots de passe avec option “appuyer pour révéler”
* Décryptage local pour consultation sécurisée
* Tests unitaires et fonctionnels intégrés

---

## Installation

1. Cloner le projet :

```bash
git clone https://github.com/votre-utilisateur/password-manager.git
cd password-manager
```

2. Installer les dépendances :

```bash
npm install
```

3. Configurer la base PostgreSQL et `.env` :

* Créer une base : `password_manager`
* Créer les tables `users` et `passwords`
* Créer un fichier `.env` avec :

```
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=Port
DB_NAME=password_manager
AES_KEY=cleSur32bit
```

4. Lancer l'application :

```bash
npm start
```

---

## Tests

* Tests unitaires : chiffrement et CRUD PostgreSQL

```bash
npm test
```

* Tests fonctionnels Electron :

```bash
npm run test:functional
```

> Une base de test `.env.test` est fournie pour exécuter les tests sans affecter vos données réelles.

---

## Contribuer


1. Forker le projet
2. Créer une branche pour votre fonctionnalité :

```bash
git checkout -b feature/ma-fonctionnalité
```

3. Commiter vos changements :

```bash
git commit -m "Ajouter une fonctionnalité X"
```

4. Pousser votre branche :

```bash
git push origin feature/ma-fonctionnalité
```

5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT. Vous êtes libre d’utiliser, modifier et distribuer le code.

