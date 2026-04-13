# TVK Makan Kuraigal Thirkum Maiyam

A campaign website for TVK candidate Aadhav Arjuna with manifesto, slideshow gallery, countdown timer, and secure issue submission storage.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create environment variables in Render or a local `.env` file:

```bash
ADMIN_USER=admin
ADMIN_PASSWORD=StrongPassword123!
COOKIE_SECRET=replace-with-a-secure-random-string
NODE_ENV=production
```

3. Start the server:

```bash
npm start
```

4. Open the website in a browser:

```
http://localhost:3000
```

## Admin access

- Visit `/admin` to log in.
- After login, view and export submitted issue forms.
- Data is stored in `data.db` and only available to authenticated admin users.

## Render deployment

- Add the repository to Render.
- Set the build command to: `npm install`
- Set the start command to: `npm start`
- Set environment variables in Render:
  - `ADMIN_USER`
  - `ADMIN_PASSWORD`
  - `COOKIE_SECRET`
  - `NODE_ENV=production`

## Notes

- The site uses red and yellow TVK palette, glassmorphism, 3D card and parallax effects.
- Candidate photo, logo, and whistle image are served from the workspace root.
- Form submission data is stored securely and admin access is protected by a login flow.
