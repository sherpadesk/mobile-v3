cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.appplant.cordova.plugin.badge/www/badge.js",
        "id": "de.appplant.cordova.plugin.badge.Badge",
        "clobbers": [
            "plugin.notification.badge",
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.launchmyapp/www/ios/LaunchMyApp.js",
        "id": "nl.x-services.plugins.launchmyapp.LaunchMyApp",
        "clobbers": [
            "window.plugins.launchmyapp"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.triarc.cookies/www/cookies.js",
        "id": "com.triarc.cookies.cookies",
        "clobbers": [
            "cookies"
        ]
    },
    {
        "file": "plugins/cordova-plugin-app-preferences/www/apppreferences.js",
        "id": "cordova-plugin-app-preferences.apppreferences",
        "clobbers": [
            "plugins.appPreferences"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "de.appplant.cordova.plugin.badge": "0.6.4",
    "org.apache.cordova.network-information": "0.2.15",
    "nl.x-services.plugins.launchmyapp": "3.2.2",
    "org.apache.cordova.inappbrowser": "0.6.0",
    "com.triarc.cookies": "0.0.1",
    "cordova-plugin-app-preferences": "0.7.1",
    "de.appplant.cordova.common.registerusernotificationsettings": "1.0.1"
}
// BOTTOM OF METADATA
});