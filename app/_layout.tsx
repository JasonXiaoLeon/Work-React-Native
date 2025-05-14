// app/_layout.tsx
import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // 可根据实际需求设置背景色
  },
});
