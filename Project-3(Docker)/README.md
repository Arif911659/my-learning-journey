# React and flask small and simple website

![image](https://github.com/Arif911659/my-learning-journey/assets/139946335/57adfb7e-fd68-47b2-8823-ff2270bdb9dd)

Learn More:
============>>>>>>>>>>>
https://medium.com/@arifaka555/containerizing-a-full-stack-web-application-a-step-by-step-guide-e9374f748177
<<<<<<<<<<<================

Help with WSL if you want to modify package.json :

1. From WSL `run sudo apt install nodejs npm` to install node & npm
2. From PowerShell/CMD run `wsl --shutdown` to restart the WSL service
3. Next in WSL run `which npm` to confirm it's installed [output: /usr/bin/npm]

install esbuild
npm install --save-exact --save-dev esbuild

check:
.\node_modules\.bin\esbuild --version

install more packages
npm install react react-dom axios


package.json
{
  "name": "react-app",
  "version": "0.1.0",
  "private": true,
  "homepage": ".",
  "main": "./src/index.js",
  "files": [
    "src"
  ],
  "scripts": {
    "build": "esbuild --loader:.js=jsx ./src/index.js --bundle --minify --outdir=build"
  },
  "devDependencies": {
    "esbuild": "^0.20.0"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
