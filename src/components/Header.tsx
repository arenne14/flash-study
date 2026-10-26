import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Top bar with the avatar, the user's name and the greeting.
export default function Header({ name }: { name: string }) {
  return (
    <View style={styles.header}>
      {/* Placeholder avatar: replace assets/images/avatar.png with your own image */}
      <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>What are you learning today?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    paddingTop: 45, paddingBottom: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#DDD',
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, backgroundColor: '#D0E4F0' },
  name: { fontSize: 18, fontWeight: 'bold' },
  sub: { fontSize: 16 },
});
