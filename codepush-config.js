// codepush-config.js
import { Platform } from 'react-native';
import CodePush from 'react-native-code-push';

const CODEPUSH_ENVIRONMENTS = {

    staging: {
        serverUrl: 'http://13.127.78.239:3000',
        ios: 'lVBhXGHXAHKGRu8zT0kJrtItcjKk4ksvOXqog',
        android: 'g3tS6zrJjovTVfh9IGfhhyDxQ7lL4ksvOXqog'
    },
    production: {
        serverUrl: 'http://13.127.78.239:3000',
        ios: 'NomXwd8aT7rJDYgt7ax1eiGPbcEO4ksvOXqog',
        android: 'A68DGaa8L4ADbU0nIMJRDwlTjBr04ksvOXqog'
    }
};

class CodePushManager {
    constructor() {
        this.environment = __DEV__ ? 'staging' : 'production';
        this.config = CODEPUSH_ENVIRONMENTS[this.environment];
    }

    setEnvironment(env) {
        this.environment = env;
        this.config = CODEPUSH_ENVIRONMENTS[env];
    }

    getDeploymentKey() {
        return Platform.OS === 'ios' ? this.config.ios : this.config.android;
    }

    getServerUrl() {
        return this.config.serverUrl;
    }

    sync(options = {}) {
        const syncOptions = {
            deploymentKey: this.getDeploymentKey(),
            serverUrl: this.getServerUrl(),
            ...options
        };

        return CodePush.sync(syncOptions);
    }

    checkForUpdate(options = {}) {
        const checkOptions = {
            deploymentKey: this.getDeploymentKey(),
            serverUrl: this.getServerUrl(),
            ...options
        };

        return CodePush.checkForUpdate(checkOptions.deploymentKey);
    }

    // Manual update with custom deployment key
    updateWithKey(deploymentKey, serverUrl = null) {
        return CodePush.sync({
            deploymentKey,
            serverUrl: serverUrl || this.getServerUrl()
        });
    }
}

export default new CodePushManager();