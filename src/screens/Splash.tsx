import React, { useEffect } from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import { loadData } from '../store/storage';

export default function Splash() {
  useEffect(() => {
    // Loads the save file, waits 2 seconds, then decides where to go.
    async function startApp() {
      const data = await loadData();
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      // No name saved yet -> ask for it. Otherwise go straight to the dashboard.
      router.replace(data.name ? '/home' : '/name');
    }
    startApp();
  }, []);

  return (
    <Screen style={styles.container}>
      {/* Placeholder logo: replace assets/images/logo.png with your own image */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>
        <Text style={{ color: '#F7DC2E' }}>Flash</Text> <Text style={{ color: '#4665BB' }}>Study</Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  appName: { fontSize: 34, fontWeight: 'bold', marginTop: 10 },
});
