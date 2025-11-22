# QA Challenge - João Leonardo Martins

## Test Framework

The chosen tool to complete this challenge was Cypress, a JavaScript-based testing platform built on Node.js. 

### Environment

The full environment setup is available on: https://docs.cypress.io/app/get-started/install-cypress, but here are the steps I followed to run Cypress for this challenge:

- Installed Debian dependencies:

```apt-get install libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb```
- Installing Node manager and checking its version:

```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash; source ~/.bashrc```  
```nvm install --lts; node -v; npm -v```

- Installing Cypress in project root directory (qa-challenge)

```npm init -y; npm install cypress --save-dev; npx cypress -v```

- Running tests:

```npx cypress open``` -> Interactive mode
```npx cypress run``` -> Automated mode

- The qa-challenge directory has the following structure:  
$ tree |more  
.  
├── cypress  
│   ├── e2e  
│   │   ├── api  
│   │   │   └── api-test.cy.js  
│   │   └── web  
│   │       ├── web-charts.cy.js  
│   │       └── web-header.cy.js  

- ... where 'api' directory includes cache and metadata conscious tests, and 'web' directory contains the charts tests and other web GUI features.

### Unexpected behaviors

After the automated tests, it was possible to identify the following unexpected behaviors:

- Incomplete information from  /metadata route: time interval is null;  
- Hovering through charts: 'Temperatura' chart doesn't provide a tooltip to the user;  
- Data is not refreshed every time.
