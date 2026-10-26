import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Screen from '../components/Screen';
import Header from '../components/Header';
import ProgressCard from '../components/ProgressCard';
import Folder, { FOLDER_COLORS } from '../components/Folder';
import ShadowBox from '../components/ShadowBox';
import { loadData, saveData, getProgress } from '../store/storage';
import { AppData } from '../types';

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [adding, setAdding] = useState(false);   // is the "new course" popup open?
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('yellow');

  // Reload the data every time this tab is shown.
  useFocusEffect(
    useCallback(() => {
      loadData().then(setData);
    }, [])
  );

  // Creates a new course and saves it.
  async function addCourse() {
    if (newName.trim() === '') return;
    const fresh = await loadData();
    fresh.courses.push({ id: 'c' + Date.now(), name: newName.trim(), color: newColor, cards: [] });
    await saveData(fresh);
    setData(fresh);
    setNewName('');
    setNewColor('yellow');
    setAdding(false);
  }

  if (!data) return <Screen />;

  // The latest course = the TOP of the recentStack (a stack! see Quiz.js).
  const topId = data.recentStack[data.recentStack.length - 1];
  const latest = data.courses.find((c) => c.id === topId);

  return (
    <Screen>
      <Header name={data.name} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {latest ? (
          <ProgressCard
            title={latest.name}
            percent={getProgress(latest)}
            onReview={() => router.push(`/quiz?courseId=${latest.id}`)}
          />
        ) : (
          <ShadowBox color="#FFE8EA" radius={20} offset={14} style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Text style={{ padding: 24, fontSize: 16 }}>No progress yet. Pick a course and start answering!</Text>
          </ShadowBox>
        )}

        <View style={styles.grid}>
          <Folder color="yellow" plus name="" onPress={() => setAdding(true)} />
          {data.courses.map((course) => (
            <Folder
              key={course.id}
              color={course.color}
              name={course.name}
              onPress={() => router.push(`/course-menu?courseId=${course.id}`)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Popup for adding a new course */}
      <Modal visible={adding} transparent animationType="fade">
        <View style={styles.overlay}>
          <ShadowBox radius={16} offset={8} style={{ width: '85%' }}>
            <View style={{ padding: 20 }}>
              <Text style={styles.modalTitle}>New Course</Text>
              <TextInput style={styles.input} placeholder="Course name" value={newName} onChangeText={setNewName} />
              <Text style={{ marginBottom: 8 }}>Folder color</Text>
              <View style={styles.colors}>
                {Object.keys(FOLDER_COLORS).map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setNewColor(key)}
                    style={[styles.dot, { backgroundColor: FOLDER_COLORS[key].front, borderWidth: newColor === key ? 4 : 1 }]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={addCourse}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Add Course</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAdding(false)} style={{ alignItems: 'center', marginTop: 12 }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ShadowBox>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 30 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 2, borderColor: '#000', padding: 12, fontSize: 16, marginBottom: 16 },
  colors: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  dot: { width: 36, height: 36, borderRadius: 18, borderColor: '#000', marginRight: 10, marginBottom: 10 },
  addBtn: { backgroundColor: '#C1FF72', borderWidth: 2, borderColor: '#000', padding: 12, alignItems: 'center' },
});
