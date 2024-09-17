# Web Dashboard

---

Allows monitoring of instrument PVs via a web page.

## Tech Stack

**Frontend:** [NextJS](https://nextjs.org/) using [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)

**Backend:** [pvws](https://github.com/ornl-epics/pvws)

## Development

To install all dependencies, use: 
```bash
  npm install
```

### Running

(if your pvws is not running locally on port 8080) create an `.env.local` file with `NEXT_PUBLIC_WS_URL` set to the pvws URL you are using. For example:

```.env.local
NEXT_PUBLIC_WS_URL=ws://<hostname>:<port>/pvws/pv
```

To start in dev mode, use:

```bash
  npm run dev
```

### Building
For a production build, run `npm run build`. To start this build natively, use `npm run start`.
