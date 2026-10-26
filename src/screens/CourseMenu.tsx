import React, { useState, useCallback } from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import ShadowBox from '../components/ShadowBox';
import { loadData, saveData } from '../store/storage';
import { Course } from '../types';

// After tapping a course: choose to Answer (take the quiz) or Edit (change the cards).
export default function CourseMenu() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData().then((data) => setCourse(data.courses.find((c) => c.id === courseId) ?? null));
    }, [])
  );

  function goAnswer() {
    if (!course) return;
    if (course.cards.length === 0) {
      Alert.alert('No cards yet', 'Tap Edit to add some cards first.');
      return;
    }
    router.push(`/quiz?courseId=${courseId}`);
  }

  async function deleteCourse() {
    if (!courseId) return;

    Alert.alert('Delete course?', `This will remove “${course?.name ?? 'this course'}” and all of its cards.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const data = await loadData();
          const updated = {
            ...data,
            courses: data.courses.filter((item) => item.id !== courseId),
            recentStack: data.recentStack.filter((id) => id !== courseId),
          };
          await saveData(updated);
          router.replace('/home');
        },
      },
    ]);
  }

  if (!course) return <Screen />;

  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ShadowBox color="#FB8C8C" radius={0} offset={3}>
          <Ionicons name="arrow-undo" size={28} color="#000" />
        </ShadowBox>
      </TouchableOpacity>

      <Text style={styles.title}>{course.name}</Text>
      <Text style={{ marginBottom: 30 }}>{course.cards.length} cards</Text>

      <TouchableOpacity onPress={goAnswer} style={styles.btnWrap}>
        <ShadowBox color="#C1FF72" radius={40} offset={5}>
          <Text style={styles.btnText}>Answer</Text>
        </ShadowBox>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push(`/editor?courseId=${courseId}`)} style={styles.btnWrap}>
        <ShadowBox color="#FFE8EA" radius={40} offset={5}>
          <Text style={styles.btnText}>Edit</Text>
        </ShadowBox>
      </TouchableOpacity>

      <TouchableOpacity onPress={deleteCourse} style={styles.deleteWrap}>
        <ShadowBox color="#FB8C8C" radius={40} offset={5}>
          <Text style={styles.deleteText}>Delete Course</Text>
        </ShadowBox>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', top: 50, left: 24 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 6, paddingHorizontal: 20 },
  btnWrap: { width: 240, marginBottom: 20 },
  btnText: { textAlign: 'center', paddingVertical: 18, fontSize: 20 },
  deleteWrap: { width: 240, marginTop: 8 },
  deleteText: { textAlign: 'center', paddingVertical: 18, fontSize: 20, fontWeight: '600' },
});
