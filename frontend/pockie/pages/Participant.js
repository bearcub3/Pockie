import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { connect } from 'react-redux';

import { colors, Row, Label, Input, Button, ButtonText } from '../utils/theme';
import SubLayout from '../components/SubLayout';

import { API_URL } from '@env';
import { updateActions } from '../actions';

function Participant({ navigation, handleEvent, route, updateData }) {
	const { userId } = route.params;
	const [email, setEmail] = useState('');
	const [nickname, setNickname] = useState(null);
	const [isDisabled, setDisabled] = useState(true);

	useEffect(() => {
		// TODO:form sanitization if this was actual commercial work
		if (email.includes('@') && nickname.length > 1) {
			setDisabled(false);
		}
	}, [email, nickname, isDisabled]);

	const contents = {
		user_id: userId,
		joint_member_email: email,
		nickname: nickname
	};

	const postRequestOption = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(contents)
	};

	function addSavingCompanion() {
		return fetch(`${API_URL}/api/user/joint`, postRequestOption)
			.then((response) => response.json())
			.then((result) => {
				Alert.alert(
					'Save Together! Save More!',
					`${result.messages}`,
					[
						{
							text: 'OK',
							onPress: () => {
								if (result.success === true) {
									setEmail('');
									setNickname(null);
									setDisabled(true);
								}
							},
						},
					],
					{ cancelable: false }
				);
				updateData(userId);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	return (
		<SubLayout title="Saving Companion" prev={navigation}>
			<View
				style={{
					marginLeft: 20,
					marginRight: 20,
					height: '100%',
					justifyContents: 'center'
				}}>
				<Row>
					<Label>Who are you inviting?</Label>
					<Input
						placeholder="ex. Wife"
						onChangeText={(text) => setNickname(text)}
						style={{ marginBottom: 30 }}
					/>
					<Label>Add your saving companion</Label>
					<Input
						placeholder="type the user's email"
						onChangeText={(text) => setEmail(text)}
					/>
				</Row>
				<Row>
					<Button
						bgcolor={
							isDisabled ? `${colors.grey2}` : `${colors.blue2}`
						}
						disabled={isDisabled}
						onPress={addSavingCompanion}>
						<ButtonText color={colors.white}>INVITE</ButtonText>
					</Button>
				</Row>
			</View>
		</SubLayout>
	);
}

const mapDispatchToProps = (dispatch) => ({
	updateData: (id) => dispatch(updateActions.updateParticipant(id)),
});

export default connect(null, mapDispatchToProps)(Participant);
