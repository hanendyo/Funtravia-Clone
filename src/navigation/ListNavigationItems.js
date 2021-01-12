import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Authorization/Login';
import SplashScreen from '../screens/SplashScreen';
import RegisterScreen from '../screens/Authorization/Register';

const SplashNavigation = createStackNavigator();
export default function ListNavigationItems() {
  return (
    <SplashNavigation.Navigator>
      <SplashNavigation.Screen name="SplashScreen" component={SplashScreen} />
      <SplashNavigation.Screen name="LoginScreen" component={LoginScreen} />
      <SplashNavigation.Screen
        name="RegisterScreen"
        component={RegisterScreen}
      />
    </SplashNavigation.Navigator>
  );
}
