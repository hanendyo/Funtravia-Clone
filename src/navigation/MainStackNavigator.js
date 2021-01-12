import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import ListNavigationItems from './ListNavigationItems';
import BottomNavigationItems from './BottomNavigationItems';

const Tab = createStackNavigator();
export default function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Tab.Screen name="SplashScreen" component={SplashScreen} />
        <Tab.Screen name="HomeScreen" component={BottomNavigationItems} />
        <Tab.Screen name="ListNavigation" component={ListNavigationItems} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
