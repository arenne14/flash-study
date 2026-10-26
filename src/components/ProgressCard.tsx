import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import ShadowBox from './ShadowBox';

// The pink "Progress" card with the purple percentage ring and a Review Now button.
type Props = { title: string; percent: number; onReview: () => void };

export default function ProgressCard({ title, percent, onReview }: Props) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <ShadowBox color="#FFE8EA" radius={20} offset={14} style={styles.wrap}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Progress</Text>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onReview} style={{ alignSelf: 'flex-start' }}>
            <ShadowBox color="#C1FF72" radius={8} offset={5}>
              <Text style={styles.button}>Review Now</Text>
            </ShadowBox>
          </TouchableOpacity>
        </View>

        <View style={{ width: 100, height: 100 }}>
          <Svg width={100} height={100}>
            <Circle cx={50} cy={50} r={radius} stroke="#BBA0F2" strokeWidth={8} fill="none" />
            <Circle
              cx={50} cy={50} r={radius} stroke="#8C52FF" strokeWidth={8} fill="none"
              strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round"
              rotation="-90" origin="50, 50"
            />
            <Circle cx={50} cy={50} r={32} fill="#8C52FF" />
          </Svg>
          <View style={styles.percentWrap}>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
        </View>
      </View>
    </ShadowBox>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 16 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold' },
  title: { fontSize: 16, marginVertical: 6 },
  button: { fontWeight: 'bold', fontSize: 16, paddingVertical: 8, paddingHorizontal: 28 },
  percentWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  percent: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
});
