import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import {View} from 'react-native';
import {
  FeedOn,
  FeedOff,
  HomeOn,
  HomeOff,
  ProfileOn,
  ProfileOff,
  Itinerary,
  ItineraryOn,
  ChatOn,
  ChatOff,
} from '../assets/svg';

const MainNavigator = createBottomTabNavigator();
export default function BottomNavigationItems() {
  return (
    <MainNavigator.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: '#209FAE',
        inactiveTintColor: '#4E4E4E',
      }}>
      <MainNavigator.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) =>
            focused ? (
              <HomeOn width="24" height="24" />
            ) : (
              <HomeOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="FeedScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({focused}) =>
            focused ? (
              <FeedOn width="24" height="24" />
            ) : (
              <FeedOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="ItineraryScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trip Planer',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Itinerary width="55" height="55" />
            ) : (
              <ItineraryOn width="55" height="55" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="ChatScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({focused}) =>
            focused ? (
              <ChatOn width="24" height="24" />
            ) : (
              <ChatOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="AccountScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({focused}) =>
            focused ? (
              <ProfileOn width="24" height="24" />
            ) : (
              <ProfileOff width="24" height="24" />
            ),
        }}
      />
    </MainNavigator.Navigator>
  );
}
