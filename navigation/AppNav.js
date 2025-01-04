import { View, Text, LogBox } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'

const Stack = createNativeStackNavigator()

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

export default function AppNav() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}