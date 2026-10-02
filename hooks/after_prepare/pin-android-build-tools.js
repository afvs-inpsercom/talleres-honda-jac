#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const extrasPath = path.join(
        context.opts.projectRoot,
        'platforms/android/app/build-extras.gradle'
    );
    const extrasDir = path.dirname(extrasPath);

    if (!fs.existsSync(extrasDir)) {
        return;
    }

    fs.writeFileSync(
        extrasPath,
        `ext.postBuildExtras = {
    android.compileSdkVersion = 30
    android.defaultConfig.targetSdkVersion = 36
    android.buildToolsVersion = "30.0.3"
}
`
    );

    const gradlePath = path.join(
        context.opts.projectRoot,
        'platforms/android/app/build.gradle'
    );
    if (fs.existsSync(gradlePath)) {
        let gradle = fs.readFileSync(gradlePath, 'utf8');
        gradle = gradle.replace(
            /buildToolsVersion\s+cordovaConfig\.LATEST_INSTALLED_BUILD_TOOLS/,
            'buildToolsVersion "30.0.3"'
        );
        if (gradle.indexOf('androidx.annotation:annotation') === -1) {
            gradle = gradle.replace(
                'implementation "androidx.webkit:webkit:1.4.0"',
                'implementation "androidx.webkit:webkit:1.4.0"\n    implementation "androidx.annotation:annotation:1.3.0"\n    implementation "androidx.print:print:1.0.0"'
            );
        }
        fs.writeFileSync(gradlePath, gradle);
    }

    console.log('Pinned compileSdk 30, targetSdk 36, build-tools 30.0.3');

    rewriteSupportImports(path.join(
        context.opts.projectRoot,
        'platforms/android/app/src/main/java'
    ));
};

function rewriteSupportImports(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }

    fs.readdirSync(dir).forEach(function (entry) {
        const fullPath = path.join(dir, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            rewriteSupportImports(fullPath);
            return;
        }
        if (!entry.endsWith('.java')) {
            return;
        }

        const original = fs.readFileSync(fullPath, 'utf8');
        const updated = original
            .replace(/android\.support\.annotation/g, 'androidx.annotation')
            .replace(/android\.support\.v4\.print/g, 'androidx.print');

        if (updated !== original) {
            fs.writeFileSync(fullPath, updated);
        }
    });
}
