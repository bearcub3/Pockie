import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Feather } from '@expo/vector-icons';
import { colors } from '../utils/theme';

import Intro from './Intro'
import SignUp from './SignUp'
import LogIn from './LogIn'
import User from './User'
import Status from './Status'
import State from './State'
import Goals from './Goals'

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const  BottomTab = () => (
    <Tab.Navigator
        initialRouteName="profile"
        labeled={false}
        barStyle={{
            backgroundColor: colors.white
        }}
        activeColor={colors.blue1}
        tabBarOptions={{
            style: {
                height: 50
            }
        }}>
        <Tab.Screen 
            name="status"
            component={Status}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="calendar" size={24} color={color} />
                )
            }} />
        <Tab.Screen 
            name="state"
            component={State}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="plus" size={24} color={color} />
                )
            }}    
        />
        <Tab.Screen 
            name="profile"
            component={User}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="user" size={24} color={color} />
                )
            }}
            />
    </Tab.Navigator>
)

export default function AppEntry(){
    return(    
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Pockie"  headerMode="screen">
                <Stack.Screen name="Pockie" component={Intro} options={{ headerShown: false }} />
                <Stack.Screen name="signup" component={SignUp} options={{ headerShown: false }} />
                <Stack.Screen name="login" component={LogIn} options={{ headerShown: false }} />
                <Stack.Screen name="profile" component={BottomTab} options={{ headerShown: false }} />
                <Stack.Screen name="Your Saving Goals" component={Goals} />
            </Stack.Navigator>
        </NavigationContainer>     
    )
}