import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Title, Header } from '../utils/theme';

import { AntDesign } from '@expo/vector-icons';

export default function SubLayout({ prev, title, children }) {
	return (
		<View style={{ flex: 1 }}>
			<Header>
				<TouchableWithoutFeedback onPress={() => prev.goBack()}>
					<AntDesign name="arrowleft" size={35} color="black" />
				</TouchableWithoutFeedback>
				<View style={{ marginTop: 35 }}>
					<Title>Your</Title>
					<Title>{title}</Title>
				</View>
			</Header>
			{children}
		</View>
	);
}
