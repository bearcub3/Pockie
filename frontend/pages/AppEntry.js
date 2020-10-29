import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Intro from './Intro'
import SignUp from './SignUp'
import LogIn from './LogIn'

const Stack = createStackNavigator();

export default function AppEntry(){
    return(    
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Pockie"  headerMode="screen">
            <Stack.Screen name="Pockie" component={Intro} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>     
    )
}