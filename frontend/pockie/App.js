import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import middlewares from './middlewares';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Feather } from '@expo/vector-icons';
import { colors } from './utils/theme';
import {
	useFonts,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	Roboto_400Regular
} from '@expo-google-fonts/dev';

const store = createStore(rootReducer, middlewares);

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

import LogIn from './pages/LogIn';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
// import Status from './Status';
// import Record from './Record';
// import Goals from './Goals';
import Settings from './pages/Settings';

import { isAuthenticated } from '@okta/okta-react-native';

const STACKS = {
	Profile: { title: 'Profile', component: Profile, icon: 'user' },
	// Status: { title: 'Status', component: Status, icon: 'calendar' },
	// Record: { title: 'Record', component: Record, icon: 'plus' },
};

const BottomTab = () => (
	<Tab.Navigator
		initialRouteName="Profile"
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
		{Object.keys(STACKS).map((name) => (
			<Tab.Screen
				key={name}
				name={name}
				getComponent={() => STACKS[name].component}
				options={{
					tabBarIcon: ({ color }) => (
						<Feather
							name={STACKS[name].icon}
							size={24}
							color={color}
						/>
					)
				}}
			/>
		))}
	</Tab.Navigator>
);

const SCREENS = {
	Home: { title: 'Log In', component: LogIn },
	SignUp: { title: 'Sign Up', component: SignUp },
	Profile: { title: 'Profile', component: BottomTab },
	Settings: { title: 'Settings', component: Settings }
	// Goals: { title: 'Your Saving Goals', component: Goals }
};

export default function App() {
	let [fontsLoaded] = useFonts({
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		Roboto_400Regular
	});

	const [authenticated, setAuthenticated] = useState(false);
	const [progress, setProgress] = useState(false);

	const checkAuthStatus = async () => {
		const { auth } = await isAuthenticated();
		if (auth === undefined) {
			setAuthenticated(false);
		} else {
			setAuthenticated(auth);
		}
		setProgress(false);
	};

	useEffect(() => {
		setProgress(true);
		checkAuthStatus();
	}, [authenticated]);

	console.log('authenticated', authenticated);

	return (
		<Provider store={store}>
			<NavigationContainer
				linking={{
					prefixes: [''],
					config: {
						initialRouteName: authenticated ? 'Profile' : 'Home',
						screens: Object.keys(SCREENS).reduce(
							(acc, name) => {
								const path = name
									.replace(/([A-Z]+)/g, '-$1')
									.replace(/^-/, '')
									.toLowerCase();

								acc[name] = {
									path,
									screens: {},
								};
								// console.log(acc);
								return acc;
							},
							{
								Home: {
									screens: {
										LogIn: 'home',
									},
								},
							}
						),
					}
				}}
				fallback={<Text>Loading...</Text>}>
				<Stack.Navigator initialRouteName="Home" headerMode="screen">
					{Object.keys(SCREENS).map((name) => (
						<Stack.Screen
							key={name}
							name={name}
							getComponent={() => SCREENS[name].component}
							options={{ headerShown: false }}
						/>
					))}
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
