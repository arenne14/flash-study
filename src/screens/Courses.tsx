import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Folder from '../components/Folder';
import { loadData } from '../store/storage';
import { AppData } from '../types';

export default function Courses() {
  const [data, setData] = useState<AppData | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData().then(setData);
    }, [])
  );

  if (!data) return <Screen />;

  return (
    <Screen>
      <Header name={data.name} />
      <ScrollView contentContainerStyle={styles.grid}>
        {data.courses.map((course) => (
          <Folder
            key={course.id}
            color={course.color}
            name={course.name}
            onPress={() => router.push(`/course-menu?courseId=${course.id}`)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 30, paddingBottom: 20 },
});
