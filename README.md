# Web Dashboard

---

Allows monitoring of instrument PVs via a web page.

## Tech Stack

**Client:** NextJS, TailwindCSS

**Server:** NextJS, pvws

## Deployment

To deploy this project run the following commands

### In the root dir

(if your pvws is not running locally on port 8080) create an `.env.local` file with `NEXT_PUBLIC_WS_URL` set to the pvws URL you are using. For example:

```.env.local
NEXT_PUBLIC_WS_URL=ws://<hostname>:<port>/pvws/pv
```

To start, use:

```bash
  npm install
```

```bash
  npm run dev
```
