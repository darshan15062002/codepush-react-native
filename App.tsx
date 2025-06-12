// App.js - Complete implementation with network logger
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, Modal } from 'react-native';
import CodePush from 'react-native-code-push';
import NetworkLogger, { startNetworkLogging } from 'react-native-network-logger';
import CodePushManager from './codepush-config.js';

const App = () => {
  const [showNetworkLogger, setShowNetworkLogger] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    // Start network logging on app start
    startNetworkLogging();

    // Check what version CodePush sees
    CodePush.getConfiguration().then(config => {
      console.log('CodePush sees app version:', config.appVersion);
    });

    // Auto-sync on app start
    CodePush.sync({
      installMode: CodePush.InstallMode.IMMEDIATE,
      updateDialog: {
        title: 'Update Available',
        description: 'A new version is available. Install now?',
        mandatoryUpdateMessage: 'This update is required.',
        mandatoryContinueButtonLabel: 'Install',
        optionalIgnoreButtonLabel: 'Later',
        optionalInstallButtonLabel: 'Install'
      }
    }, (status) => {
      console.log("CodePush status: ", status);
    }, (progress) => {
      console.log(`Progress: ${progress.receivedBytes} / ${progress.totalBytes}`);
    });
  }, []);

  const manualCheck = () => {
    CodePush.checkForUpdate()
      .then(update => {
        console.log(update, "=================");
        if (update) {
          Alert.alert('Update found', 'Install now?', [
            { text: 'Later' },
            { text: 'Install', onPress: () => CodePush.sync() }
          ]);
        } else {
          Alert.alert('No updates', 'You have the latest version');
        }
      });
  };

  const switchToStaging = () => {
    if (CodePushManager?.setEnvironment) {
      CodePushManager.setEnvironment('staging');
      CodePushManager.sync();
    }
  };

  // Triple tap to show network logger (for release builds)
  const handleTripleTap = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount === 3) {
      setShowNetworkLogger(true);
      setTapCount(0);
    }

    // Reset tap count after 2 seconds
    setTimeout(() => setTapCount(0), 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', padding: 20 }}>
      <TouchableOpacity onPress={handleTripleTap} style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          CodePush with Network Logger
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12, color: 'gray', marginTop: 5 }}>
          Triple tap here to show network logs
        </Text>
      </TouchableOpacity>

      <View style={{ gap: 10 }}>
        <Button title="Check for Updates" onPress={manualCheck} />
        <Button title="Switch to Staging" onPress={switchToStaging} />
        <Button
          title="Show Network Logs"
          onPress={() => setShowNetworkLogger(true)}
        />
      </View>

      {/* Network Logger Modal */}
      <Modal
        visible={showNetworkLogger}
        animationType="slide"
        onRequestClose={() => setShowNetworkLogger(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            backgroundColor: '#f0f0f0',
            borderBottomWidth: 1,
            borderBottomColor: '#ddd'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Network Logs</Text>
            <Button title="Close" onPress={() => setShowNetworkLogger(false)} />
          </View>
          <NetworkLogger />
        </View>
      </Modal>
    </View>
  );
};

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.MANUAL
})(App);