import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const features = [
  { name: '聊天', icon: 'chatbubble-ellipses-outline', color: '#4A90E2' },
  { name: '工作进程', icon: 'bar-chart-outline', color: '#50E3C2' },
  { name: '会议预约', icon: 'calendar-outline', color: '#F5A623' },
  { name: '项目管理', icon: 'folder-open-outline', color: '#8E44AD' },
  { name: '测试进程', icon: 'flask-outline', color: '#E67E22' },
  { name: '代码评论', icon: 'code-slash-outline', color: '#2ECC71' },
  { name: '文档中心', icon: 'document-text-outline', color: '#3498DB' },
  { name: '客户支持', icon: 'help-buoy-outline', color: '#E74C3C' },
  { name: '发布管理', icon: 'rocket-outline', color: '#9B59B6' },
  { name: '问题追踪', icon: 'bug-outline', color: '#D35400' },
  { name: '团队成员', icon: 'people-outline', color: '#1ABC9C' },
  { name: '数据看板', icon: 'analytics-outline', color: '#34495E' },
]

const WorkspaceScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>工作区</Text>

      <View style={styles.grid}>
        {features.map((item, index) => (
          <TouchableOpacity key={index} style={styles.gridItem}>
            <Ionicons name={item.icon as any} size={40} color={item.color} />
            <Text style={styles.gridText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default WorkspaceScreen

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 20,
    backgroundColor: '#f0f4f7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  gridText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
})
