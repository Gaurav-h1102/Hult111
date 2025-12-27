// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens
import ProgressDashboard from '../screens/ProgressDashboard';
import AssignmentsScreen from '../screens/AssignmentsScreen';
// Import other existing screens...

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AssignmentsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AssignmentsMain"
      component={AssignmentsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ProgressStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProgressMain"
      component={ProgressDashboard}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Progress') {
            iconName = focused ? 'chart-line' : 'chart-line-variant';
          } else if (route.name === 'Assignments') {
            iconName = focused ? 'timetable' : 'timetable-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2a5caa',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: '#2a5caa',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen} // Your existing home screen
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStack}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsStack}
        options={{ title: 'Assignments' }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen} // Your existing courses screen
        options={{ title: 'Courses' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} // Your existing profile screen
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;