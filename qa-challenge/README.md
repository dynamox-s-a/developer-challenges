# QA Challenge - João Leonardo Martins

## Test Framework

The tool chosen to complete this challenge is Cypress, a JavaScript-based testing platform built on Node.js. 

### Environment

The full environment setup is available on: https://docs.cypress.io/app/get-started/install-cypress, but here are the steps I followed to run Cypress for this challenge:

- Installed Debian dependencies:

```apt-get install libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb```
- Installing Node manager and checkit its version:

```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash; source ~/.bashrc```  
```nvm install --lts; node -v; npm -v```

- Installing Cypress in project root directory (qa-challenge)

```npm init -y; npm install cypress --save-dev; npx cypress -v```
