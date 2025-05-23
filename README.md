# Web Dashboard

---

Allows monitoring of instrument PVs via a web page.

## Tech Stack

**Frontend:** [NextJS](https://nextjs.org/) using [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)

**Backend:** [pvws](https://github.com/ornl-epics/pvws) - with [our configuration here](https://github.com/ISISComputingGroup/pvws-config)

## Development

[Install NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - we are using `nvm-windows` for installing on windows, and the `lts` version of node.

To install all dependencies, use:

```bash
  npm ci
```

### Running

This web dashboard relies on a PVWS instance to forward EPICS data via a websocket. If you don't want to point your instance to the deployed websocket on NDAEXTWEB, you may point your web dashboard at a local instance for dev work.

<details>
  <summary>Running PVWS locally for development</summary>
  
  To run a PVWS instance locally, the [Tomcat 9](https://tomcat.apache.org/download-90.cgi) binaries need to be downloaded. 
  After this: 
  1. Download the nightly webapp `pvws.war` from the [PVWS homepage](https://github.com/ornl-epics/pvws) and place it in `webapps\` of your tomcat download
  2. Create a file called `setenv.bat` in the `bin\` folder of tomcat with your `EPICS_CA_ADDR_LIST` and `EPICS_CA_AUTO_ADDR_LIST` (you can get these by doing `set EPICS_CA` in an `epicsterm.bat`) ie this, where 1.2.3.4 is your CA gateway address: 
```bat
set EPICS_CA_ADDR_LIST=127.255.255.255 1.2.3.4
set EPICS_CA_AUTO_ADDR_LIST=NO
```
  3. `cd` to `bin\` and run `catalina.bat start` to start the tomcat server. you can verify this is working by going to `http://localhost:8080/pvws/` - you should see a summary webpage.
  4.  Create an `.env.local` file with `NEXT_PUBLIC_WS_URL` set to the pvws URL you are using. For example:

```.env.local
NEXT_PUBLIC_WS_URL=ws://<hostname>:<port>/pvws/pv
```

</details>

To start in dev mode, use:

```bash
  npm run dev
```

To build and start in prod mode, use:

```bash
  npm run build && npx serve@latest out
```

> [!NOTE]  
> Images will not work properly here as a basePath has not been injected (as per the CI actions)
