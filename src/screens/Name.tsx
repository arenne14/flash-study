import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Screen from '../components/Screen';
import ShadowBox from '../components/ShadowBox';
import { loadData, saveData } from '../store/storage';

export default function Name() {
  const [name, setName] = useState('');

  // Saves the name into data.json (so we never ask again), then opens the dashboard.
  async function handleContinue() {
    if (name.trim() === '') return;
    const data = await loadData();
    data.name = name.trim();
    await saveData(data);
    router.replace('/home');
  }

  return (
    <Screen style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>What&apos;s your name?</Text>

      <Text style={styles.label}>NAME</Text>
      <ShadowBox radius={0} color="#FFF" offset={8} style={{ marginBottom: 20 }}>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Type your name" />
      </ShadowBox>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 28, justifyContent: 'center' },
  logo: { width: 70, height: 70, alignSelf: 'center', resizeMode: 'contain' },
  title: { fontSize: 48, fontWeight: 'bold', color: '#4665BB', textAlign: 'center' },
  subtitle: { fontSize: 22, color: '#F7DC2E', textAlign: 'center', marginBottom: 40 },
  label: { color: '#4665BB', letterSpacing: 3, marginBottom: 6, fontSize: 16 },
  input: { padding: 16, fontSize: 18 },
  button: { backgroundColor: '#F7DC2E', paddingVertical: 20, alignItems: 'center' },
  buttonText: { color: '#4665BB', fontWeight: 'bold', fontSize: 20 },
});
