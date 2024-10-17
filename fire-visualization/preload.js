const { contextBridge } = require('electron');
const path = require('path');

const { parsed: envVars } = require('dotenv').config({ path: path.join(__dirname, '.env') });

contextBridge.exposeInMainWorld('env', envVars ?? {});
