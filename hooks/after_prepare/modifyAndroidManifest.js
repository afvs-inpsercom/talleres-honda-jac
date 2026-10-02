#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const manifestPath = path.join(platformRoot, 'app/src/main/AndroidManifest.xml');

    if (!fs.existsSync(manifestPath)) {
        return;
    }

    let data = fs.readFileSync(manifestPath, 'utf8');
    let changed = false;

    if (data.indexOf('android:usesCleartextTraffic="true"') === -1) {
        data = data.replace(
            '<application',
            '<application android:usesCleartextTraffic="true"'
        );
        changed = true;
        console.log('AndroidManifest.xml updated with usesCleartextTraffic');
    }

    if (!/android:name="MainActivity"[^>]*android:exported=/.test(data) &&
        !/android:exported="[^"]+"[^>]*android:name="MainActivity"/.test(data)) {
        data = data.replace(
            'android:name="MainActivity"',
            'android:exported="true" android:name="MainActivity"'
        );
        changed = true;
        console.log('AndroidManifest.xml MainActivity exported=true');
    }

    const storagePermissions = [
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE'
    ];

    storagePermissions.forEach(function (permission) {
        const permissionRegex = new RegExp(
            '\\s*<uses-permission[^>]*android:name="' + permission + '"[^>]*/>',
            'g'
        );
        const matches = data.match(permissionRegex) || [];
        if (matches.length === 0) {
            return;
        }

        const replacement =
            '\n    <uses-permission android:name="' +
            permission +
            '" android:maxSdkVersion="32" />';
        data = data.replace(permissionRegex, '');
        data = data.replace(
            '</manifest>',
            replacement + '\n</manifest>'
        );
        changed = true;
    });

    if (changed) {
        fs.writeFileSync(manifestPath, data, 'utf8');
        console.log('AndroidManifest.xml storage permissions normalized for API 36');
    }
};
