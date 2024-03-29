# React and flask small and simple website

[Project Information](#info)

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
  "scripts": {
    "build": "esbuild src/index.js --bundle --outfile=build/Bundle.js --loader:.js=jsx --format=esm"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "esbuild": "^0.20.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
