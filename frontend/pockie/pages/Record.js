import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import styled from 'emotion-native-extended';
import { connect } from 'react-redux';
import {
	colors,
	fonts,
	Title,
	Row,
	Label,
	Button,
	ButtonText,
} from '../utils/theme';

import DropDownPicker from 'react-native-dropdown-picker';
import ToggleSwitch from 'toggle-switch-react-native';

import { API_URL } from '@env';
import { updateActions } from '../actions';
import { expenseTypes, incomeTypes } from '../utils/helper';

const tabs = ['EXPENSE', 'SAVING', 'INCOME'];

const TabContainer = styled.View`
	flex-direction: row;
	margin: 20px 0;
`;

const Expense = styled.TouchableHighlight`
	width: 33.333333%;
	height: 40px;
	background-color: ${(props) => props.bg};
	color: ${(props) => props.color};
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-style: solid;
	border-color: ${colors.blue1};
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
`;

const Saving = styled.TouchableHighlight`
	width: 33.333333%;
	height: 40px;
	background-color: ${(props) => props.bg};
	color: ${(props) => props.color};
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-style: solid;
	border-color: ${colors.green};
	border-right-width: 0;
	border-left-width: 0;
`;

const Income = styled.TouchableHighlight`
	width: 33.333333%;
	height: 40px;
	background-color: ${(props) => props.bg};
	color: ${(props) => props.color};
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-style: solid;
	border-color: ${colors.red};
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
`;

const TabText = styled.Text`
	font-family: ${fonts.normal};
	color: ${(props) => props.color};
`;

const CurrencySymbol = styled.Text`
	font-family: ${fonts.normal};
	font-size: 30;
	color: ${(props) => props.color};
`;

const NumberInput = styled.TextInput`
	width: 80%;
	height: 70px;
	font-family: ${fonts.normal};
	font-size: 50;
	letter-spacing: -1;
	color: ${(props) => props.color};
	text-align: center;
`;

const NumberColor = (value) => {
	switch (value) {
		case 0:
			return `${colors.blue1}`;
		case 1:
			return `${colors.green}`;
		case 2:
			return `${colors.red}`;
		default:
	}
};

const dataTypeChecker = (value) => {
	switch (value) {
		case 0:
			return 'expense';
		case 1:
			return 'savings';
		case 2:
			return 'income';
		default:
	}
};

function Record({
	user,
	privateSavingPurpose,
	jointSavingPurpose,
	handleSaving,
	handleToday,
}) {
	const [whichType, setType] = useState(0);
	const [purposeType, setpurposeType] = useState(null);
	const [amount, setAmount] = useState(0);
	const [dataType, setData] = useState('expense');
	const [isDisabled, setDisabled] = useState(true);
	const [currentPurpose, setPurpose] = useState(expenseTypes);
	const [isPersonal, setPersonal] = useState(true);

	function listType(value) {
		switch (value) {
			case 0:
				return expenseTypes;
			case 1:
				return privateSavingPurpose;
			case 2:
				return incomeTypes;
			default:
		}
	}

	useEffect(() => {
		setData(dataTypeChecker(whichType));
		setPurpose(listType(whichType));
		setpurposeType(null);
		return () => {
			setData('expense');
			setPurpose(listType(whichType));
			setpurposeType(null);
		};
	}, [whichType]);

	useEffect(() => {
		if (amount > 0) {
			setDisabled(false);
		}
		return () => setDisabled(true);
	}, [amount]);

	const contents = {
		user_id: user.id,
		type: purposeType,
		amount: +amount
	};

	const goal = {
		goal_id: purposeType,
		amount: +amount,
	};

	const postRequestOption = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: whichType === 1 ? JSON.stringify(goal) : JSON.stringify(contents),
	};

	const handleTallying = async () => {
		await fetch(`${API_URL}/api/${dataType}`, postRequestOption)
			.then((response) => response.json())
			.then((result) => {
				let message;
				result.success === true
					? (message = result.messages)
					: (message = 'There was an error. Try again!');
				Alert.alert(
					`Today's ${dataType.toUpperCase()}`,
					`${message}`,
					[
						{
							text: 'OK',
							onPress: () => {
								if (result.success === true) {
									setType(0);
									setpurposeType(0);
									setAmount(0);
								}
							},
						},
					],
					{ cancelable: false }
				);
				dataType === 'savings'
					? handleSaving(user.id)
					: handleToday(user.id);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<View style={{ flex: 1, marginTop: 60, padding: 30 }}>
			<Title>How's it going?</Title>

			<TabContainer>
				<Expense
					bg={whichType === 0 ? `${colors.blue1}` : `${colors.white}`}
					underlayColor={`${colors.grey4}`}
					onPress={() => setType(0)}>
					<TabText
						color={
							whichType === 0
								? `${colors.white}`
								: `${colors.blue1}`
						}>
						{tabs[0]}
					</TabText>
				</Expense>
				<Saving
					bg={whichType === 1 ? `${colors.green}` : `${colors.white}`}
					underlayColor={`${colors.grey4}`}
					onPress={() => setType(1)}>
					<TabText
						color={
							whichType === 1
								? `${colors.white}`
								: `${colors.green}`
						}>
						{tabs[1]}
					</TabText>
				</Saving>
				<Income
					bg={whichType === 2 ? `${colors.red}` : `${colors.white}`}
					underlayColor={`${colors.grey4}`}
					onPress={() => setType(2)}>
					<TabText
						color={
							whichType === 2
								? `${colors.white}`
								: `${colors.red}`
						}>
						{tabs[2]}
					</TabText>
				</Income>
			</TabContainer>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 30,
					marginBottom: 30,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<CurrencySymbol color={NumberColor(whichType)}>
					£
				</CurrencySymbol>
				<NumberInput
					color={NumberColor(whichType)}
					defaultValue="0"
					keyboardType="number-pad"
					style={{ height: 100 }}
					onChangeText={(text) => setAmount(text)}
				/>
			</View>

			<Row
				style={{
					position: 'relative',
					zIndex: 0
				}}>
				<Label>Description</Label>
				{whichType !== 1 && (
					<DropDownPicker
						items={currentPurpose}
						defaultValue={purposeType}
						containerStyle={{ height: 40 }}
						style={{
							backgroundColor: '#fafafa',
							position: 'absolute',
							zIndex: 10,
						}}
						itemStyle={{
							justifyContent: 'flex-start',
						}}
						dropDownStyle={{
							backgroundColor: `${colors.white}`
						}}
						onChangeItem={(item, idx) => setpurposeType(idx)}
					/>
				)}
				{whichType === 1 && (
					<>
						<DropDownPicker
							items={
								isPersonal
									? privateSavingPurpose
									: jointSavingPurpose
							}
							defaultValue={purposeType}
							containerStyle={{ height: 40 }}
							style={{
								backgroundColor: '#fafafa',
								position: 'absolute',
								zIndex: 15,
							}}
							itemStyle={{
								justifyContent: 'flex-start',
							}}
							dropDownStyle={{
								backgroundColor: `${colors.white}`
							}}
							onChangeItem={(item, idx) =>
								setpurposeType(item.value)
							}
						/>
						<Row
							style={{
								position: 'absolute',
								top: 70,
								zIndex: 10,
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Label style={{ width: '88%' }}>
								Personal Saving
							</Label>
							<ToggleSwitch
								isOn={isPersonal}
								onColor={colors.blue3}
								offColor={colors.grey2}
								size="small"
								onToggle={(isOn) => setPersonal(!isPersonal)}
							/>
						</Row>
					</>
				)}
				<Button
					style={{ marginTop: 80 }}
					disabled={isDisabled}
					bgcolor={NumberColor(whichType)}
					onPress={handleTallying}>
					<ButtonText color={colors.white}>SAVE</ButtonText>
				</Button>
			</Row>
		</View>
	);
}

function mapStateToProps(state) {
	const { user, savings } = state.authentication;

	let privateSaving = savings.filter(
		(saving) => saving.joint_members.length === 0 && !saving.completed
	);

	const privateSavingPurpose = privateSaving.flatMap((saving, idx) => [
		{
			label: 'Saving goal: ' + saving.goal_amount,
			value: saving.goal_id,
		}
	]);

	const jointSaving = savings.filter(
		(saving) => saving.joint_members.length > 0 && !saving.completed
	);

	const jointSavingPurpose = jointSaving.flatMap((saving, idx) => [
		{
			label: 'Saving goal: ' + saving.goal_amount,
			value: saving.goal_id,
		}
	]);

	return { user, privateSavingPurpose, jointSavingPurpose };
}

const mapDispatchToProps = (dispatch) => ({
	handleToday: (id) => dispatch(updateActions.updateToday(id)),
	handleSaving: (id) => dispatch(updateActions.updateSaving(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Record);
