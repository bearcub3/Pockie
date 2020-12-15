import React, { useState, useEffect } from 'react';
// import { Alert } from 'react-native';
import styled from 'emotion-native-extended';
import ToggleSwitch from 'toggle-switch-react-native';
//import * as Localization from 'expo-localization';
import { colors, Label, Button, ButtonText, Row } from '../utils/theme';

import Layout from '../components/Layout';
import Header from '../components/Header';

const Column = styled.View`
	width: 50%;
`;

const Input = styled.TextInput`
	border-width: 1px;
	border-color: ${colors.grey3};
	border-radius: 5px;
	padding: 5px 10px;
`;

export default function SignUp({ register, submitted, navigation }) {
	const [disabled, setDisabled] = useState(true);
	const [givenName, setGivenName] = useState('');
	const [famName, setFamName] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [joint, setJoint] = useState(false);
	const [currency, setCurrency] = useState('');

	// useEffect(() => {
	// 	const locale = Localization.locale;
	// 	//locale === 'en-GB' ? setCurrency('GBP') : setCurrency('KRW');
	// 	locale === 'en-US' ? setCurrency('GBP') : setCurrency('KRW');

	// 	return () => {
	// 		setCurrency('');
	// 	};
	// }, [currency]);

	useEffect(() => {
		if ((givenName, famName, email, password)) {
			setDisabled(false);
		}

		return () => {
			setDisabled(!disabled);
		};
	}, [disabled, givenName, famName, email, password]);

	// const handleRegisterUser = () => {
	// 	auth0.auth
	// 		.createUser({
	// 			connection: `${AUTH0_CONNECTION}`,
	// 			email: email,
	// 			password: password,
	// 		})
	// 		.then(() => {
	// 			Alert.alert('Pockie Sign-Up', 'Thank you for joining us!');
	// 			register({
	// 				first_name: givenName,
	// 				last_name: famName,
	// 				email: email,
	// 				participants: [],
	// 				joint: joint,
	// 				currency: currency
	// 			});
	// 			navigation.navigate('Pockie');
	// 		})
	// 		.catch(console.error);
	// };

	return (
		<Layout>
			<Header title="Sign Up" />
			<Row style={{ flexDirection: 'row' }}>
				<Column>
					<Label>Given Name</Label>
					<Input
						onChangeText={(text) => setGivenName(text)}
						value={givenName}
						style={{ marginRight: 10 }}
					/>
				</Column>
				<Column>
					<Label>Family Name</Label>
					<Input
						onChangeText={(text) => setFamName(text)}
						value={famName}
					/>
				</Column>
			</Row>

			<Row>
				<Label>Email Address</Label>
				<Input onChangeText={(text) => setEmail(text)} value={email} />
			</Row>

			<Row>
				<Label>New Password</Label>
				<Input
					onChangeText={(text) => setPassword(text)}
					value={password}
				/>
			</Row>

			<Row style={{ flexDirection: 'row' }}>
				<Column>
					<Label>Joint?</Label>
				</Column>
				<Column style={{ alignItems: 'flex-end' }}>
					<ToggleSwitch
						isOn={joint}
						onColor={colors.blue3}
						offColor={colors.grey4}
						onToggle={(isOn) => setJoint(isOn)}
					/>
				</Column>
			</Row>

			{/* {
                joint && (<Row>
                    <Label>Participants</Label>
                    <Input onChangeText={(text) => setPassword(text)} value={password} />
                </Row>)
            } */}

			<Row>
				<Button bgcolor={colors.blue2} disabled={disabled}>
					<ButtonText color={colors.white}>CONFIRM</ButtonText>
				</Button>
			</Row>
		</Layout>
	);
}
