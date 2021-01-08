import React from 'react';
import { View, Image } from 'react-native';
import { colors, Row, Button, ButtonText, Welcome } from '../utils/theme';

import Layout from '../components/Layout';

const image = {
	width: 298,
	height: 210,
};

export default function Entry({ navigation }) {
	return (
		<Layout>
			<View style={{ height: '70%' }}>
				<Image
					source={require('../assets/images/initial_context.png')}
					style={image}
				/>
			</View>
			<Welcome>WELCOME TO POCKIE</Welcome>
			<Row>
				{/* <Button
					bgcolor={colors.blue2}
					onPress={() => navigation.navigate('SignUp')}>
					<ButtonText color={colors.white}>SIGN UP</ButtonText>
				</Button> */}
				<Button
					bgcolor={colors.blue2}
					onPress={() => navigation.navigate('LogIn')}>
					<ButtonText color={colors.white}>START</ButtonText>
				</Button>
			</Row>
		</Layout>
	);
}
