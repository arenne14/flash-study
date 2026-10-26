import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

// A box with the hard black shadow used all over the design.
type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  color?: string;
  offset?: number;
};

export default function ShadowBox({ children, style, radius = 12, color = '#FFFFFF', offset = 6 }: Props) {
  return (
    <View style={[{ paddingRight: offset, paddingBottom: offset }, style]}>
      <View
        style={{
          position: 'absolute', left: offset, top: offset, right: 0, bottom: 0,
          backgroundColor: '#000', borderRadius: radius,
        }}
      />
      <View style={{ backgroundColor: color, borderRadius: radius, borderWidth: 1, borderColor: '#000' }}>
        {children}
      </View>
    </View>
  );
}
