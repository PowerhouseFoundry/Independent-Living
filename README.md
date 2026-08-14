# Powerhouse Independent Living Skills Check - Render + Firestore Build

This is the deployment build for the West SILC Powerhouse Independent Living Skills Check.

## Deployment model

- **GitHub** stores the project source.
- **Render Static Site** hosts the website.
- **Cloud Firestore** stores shared classes, learner usernames/password hashes and assessment progress.
- **Firebase Authentication is not used** because this is a low-risk training/self-assessment system.

The Firebase web configuration for project `home-management-d0a62` is already present in `public/firebase-config.js`.

## Included features

- Powerhouse branded learner login.
- Learner username and password sign-in.
- No demo credentials displayed on the login page.
- Staff login mode accessed from the small cog button.
- Staff area for classes and learner accounts.
- Learners can be assigned to Mint, Peach, Amber, Teal, Sage, Orange or additional classes created by staff.
- Eight visual independent-living zones.
- Question symbols and zone artwork.
- Read-aloud controls for non-readers using browser/device speech synthesis.
- Automatic scoring and progress.
- Staff assessment overview and reset controls.
- Home Hub link.
- Shared Firestore saving so progress can be opened on another device.

## Project structure

```text
powerhouse-independent-living-v4-render-firestore/
|-- .firebaserc
|-- .gitignore
|-- firebase.json
|-- firestore.rules
|-- render.yaml
|-- FIREBASE-QUICK-SETUP.txt
|-- README.md
`-- public/
    |-- index.html
    |-- styles.css
    |-- app.js
    |-- firebase-config.js
    `-- assets/
        |-- powerhouse-logo.png
        |-- house-artwork.png
        |-- login-background.png
        |-- zones/
        `-- fontawesome/
```

## Firebase project

The app is configured for:

```text
Project ID: home-management-d0a62
```

`public/firebase-config.js` is already completed.

Firebase's browser configuration identifies the Firebase project; it is not a service-account secret. Do not add service-account keys to this project.

## First Firebase setup

Create a Cloud Firestore database in the Firebase Console if it has not already been created.

Then publish the included rules. From Terminal in this folder:

```bash
firebase login
firebase deploy --only firestore:rules
```

If the Firebase CLI is not installed:

```bash
npm install -g firebase-tools
```

Alternatively, open **Firestore Database > Rules** in Firebase Console, paste the contents of `firestore.rules`, and press **Publish**.

The app deliberately does not use Firebase Authentication. The Firestore rules therefore validate the permitted document structures but do not provide genuine user-level privacy. Keep the stored information limited to this training/self-assessment use.

## Render deployment

The included `render.yaml` is configured as a static site:

```yaml
services:
  - type: web
    runtime: static
    name: powerhouse-independent-living
    buildCommand: echo "Static site - no build step required"
    staticPublishPath: ./public
    autoDeploy: true
```

If you create the Render Static Site manually, use:

```text
Build command: echo "Static site - no build step required"
Publish directory: public
```

Push changes to the connected GitHub branch and Render can redeploy the website automatically.

## First database load

When the website successfully opens against an empty Firestore database, the app seeds:

- Mint
- Peach
- Amber
- Teal
- Sage
- Orange
- initial staff settings

No demo learner is added to Firestore.

## Storage model

Firestore collections used by the app:

```text
settings/admin
classes/{classId}
learners/{learnerId}
```

Learner documents contain the display name, class ID, username, password hash, assessment responses and update timestamp.

## Password note

Passwords are hashed in the browser before being stored. This is a convenience barrier for a training tool, not a secure authentication system. Because Firebase Authentication is deliberately not being used, do not treat the staff area or learner accounts as protection for confidential information.

## Updating the site

For ordinary changes to HTML, CSS, JavaScript, questions or artwork:

```bash
git add .
git commit -m "Update independent living app"
git push
```

Render can then publish the updated site.

If `firestore.rules` changes, also run:

```bash
firebase deploy --only firestore:rules
```

## Local test

From the project folder:

```bash
python3 -m http.server 8000 --directory public
```

Then open:

```text
http://localhost:8000
```

The local version connects to the same Firestore project, so any test accounts or assessment responses created locally will also be in the online database.

## Important data rule

Keep this system for independent-living self-assessment only. Do not add confidential learner records, EHCP content, medical information, home addresses or other sensitive personal information.
