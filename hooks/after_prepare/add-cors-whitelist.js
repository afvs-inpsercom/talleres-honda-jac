#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

function addAccessOriginConfig(configFile) {
    var content = fs.readFileSync(configFile, 'utf8');
    
    if (content.indexOf('<access origin="*" />') === -1) {
        // Agregar las reglas de acceso necesarias
        var newConfig = content.replace('</widget>', '<access origin="*" />\n</widget>');
        fs.writeFileSync(configFile, newConfig, 'utf8');
        console.log('Se ha agregado la configuración CORS en config.xml');
    }
}

if (rootdir) {
    var configFile = path.join(rootdir, 'config.xml');
    if (fs.existsSync(configFile)) {
        addAccessOriginConfig(configFile);
    } else {
        console.error('No se encontró config.xml');
    }
}
