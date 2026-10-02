# kia-talleres

## Instalación del Proyecto
```
npm install
```

## Agregar Plataforma
```
cordova platform add android
```

## Compilar en Celular Android por USB
```
cordova run android --device
```

## Usar Chrome Dev Tools para debugear la aplicación
[En Google Chrome](chrome://inspect/#devices)
```
chrome://inspect/#devices
```

## version de la app

sudo xattr -d com.apple.quarantine platforms/android/gradlew
cordova clean android
cordova platform remove android
cordova platform add android@10.0.0
cordova build android
cordova run android