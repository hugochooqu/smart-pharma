import { Ionicons } from '@expo/vector-icons';
import {  Redirect, Slot, Tabs } from 'expo-router'
import { Text, View } from 'react-native';

const TabBarIcon = ({focused, icon, title}: any) => (
  <View className='mt-2 flex items-center justify-center ' style={{ width: 70 }}>
    <Ionicons size={20} name={icon} color={focused ? '#4A90E2' : '#666'} />
    <Text className='text-sm font-bold'>{title}</Text>
  </View>
)
export default function _Layout() {
    const isAuthenticated = false;

    if(!isAuthenticated) return <Redirect href='/sign-in' />
  return (
    <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 10,
                    height: 50,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingTop: 4,
                    flexDirection: 'row'
                }
            }}>
              <Tabs.Screen name='index' options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon : ({ focused}) => <TabBarIcon title='Home' icon='home-outline' focused={focused} />
        }} />

        <Tabs.Screen name='symptoms' options={{
            title: 'Symptoms',
            headerShown: false,
            tabBarIcon : ({ focused}) => <TabBarIcon title='Symptoms' icon='medical-outline' focused={focused} />
        }} />

        <Tabs.Screen name='progress' options={{
            title: 'Progress',
            headerShown: false,
            tabBarIcon : ({ focused}) => <TabBarIcon title='Progress' icon='trending-up-outline' focused={focused} />
        }} />

        <Tabs.Screen name='reminders' options={{
            title: 'Reminder',
            headerShown: false,
            tabBarIcon : ({ focused}) => <TabBarIcon title='Reminders' icon='notifications-outline' focused={focused} />
        }} />

        <Tabs.Screen name='profile' options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon : ({ focused}) => <TabBarIcon title='Profile' icon='person-outline' focused={focused} />
        }} />

        
    </Tabs>
  ) 
}