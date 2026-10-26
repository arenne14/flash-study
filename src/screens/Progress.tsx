import React, { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Screen from '../components/Screen';
import Header from '../components/Header';
import ProgressCard from '../components/ProgressCard';
import { loadData, getProgress } from '../store/storage';
import { AppData } from '../types';

export default function Progress() {
  const [data, setData] = useState<AppData | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData().then(setData);
    }, [])
  );

  if (!data) return <Screen />;

  // One progress card for every course.
  return (
    <Screen>
      <Header name={data.name} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {data.courses.map((course) => (
          <ProgressCard
            key={course.id}
            title={course.name}
            percent={getProgress(course)}
            onReview={() => router.push(`/quiz?courseId=${course.id}`)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
