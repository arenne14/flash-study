import React, { useState, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Screen from '../components/Screen';
import ShadowBox from '../components/ShadowBox';
import { loadData, saveData } from '../store/storage';

export default function Profile() {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData().then((data) => setName(data.name));
    }, [])
  );

  // Saves the new name in data.json.
  async function saveName() {
    if (name.trim() === '') return;
    const data = await loadData();
    data.name = name.trim();
    await saveData(data);
    setEditing(false);
  }

  return (
    <Screen>
      <View style={styles.top}>
        {/* Placeholder avatar: replace assets/images/avatar.png */}
        <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
        {editing ? (
          <TextInput style={styles.nameInput} value={name} onChangeText={setName} autoFocus />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}
      </View>

      <View style={{ alignItems: 'center', marginTop: 28 }}>
        <TouchableOpacity onPress={editing ? saveName : () => setEditing(true)} style={{ width: 200 }}>
          <ShadowBox radius={0} offset={5}>
            <Text style={styles.btnText}>{editing ? 'Save' : 'Edit Profile'}</Text>
          </ShadowBox>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { backgroundColor: '#FFF', alignItems: 'center', paddingTop: 100, paddingBottom: 30, borderBottomWidth: 3, borderBottomColor: '#000' },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#D0E4F0' },
  name: { fontSize: 26, fontWeight: 'bold', marginTop: 12 },
  nameInput: { fontSize: 26, fontWeight: 'bold', marginTop: 12, borderBottomWidth: 2, minWidth: 200, textAlign: 'center' },
  btnText: { textAlign: 'center', paddingVertical: 14, fontSize: 15 },
});
