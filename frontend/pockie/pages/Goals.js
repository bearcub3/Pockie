import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import styled from 'emotion-native-extended';

import { colors, fonts, TagBG, TagText } from '../utils/theme';
import SubLayout from '../components/SubLayout';
import StateContext from '../context/StateContext';
import Tab from '../components/Tab';
import ScreenLayout from '../components/ScreenLayout';

import DropDownPicker from 'react-native-dropdown-picker';
import ToggleSwitch from 'toggle-switch-react-native';
import ConfirmButton from '../components/ConfirmButton';

import SAVING_ICON from '../assets/images/saving_icon.svg';
import { API_URL } from '@env';
import { updateActions } from '../actions';
import { savingPurpose } from '../utils/helper';

const PeriodWrapper = styled.View`
	position: absolute;
	margin-top: -45;
	right: 0;
`;

const Period = styled.Text`
	font-family: ${fonts.main};
	font-size: 13;
	color: ${colors.black};

	&::first-of-type {
		margin-bottom: -5;
	}
`;

const PurposeWrapper = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 35px;
`;

const Purpose = styled.Text`
	color: ${(props) => props.color};
	font-family: ${fonts.main};
	font-size: 24;
	margin-left: 10px;
`;

const BarWrapper = styled.View`
	justify-content: center;
	align-items: center;
`;

const FullBar = styled.View`
	width: 100%;
	height: 10px;
	border-radius: 5px;
	background-color: ${colors.grey3};
`;

const CurrentBar = styled.View`
	width: ${(props) => props.percentage};
	height: 10px;
	border-radius: 5px;
	background-color: ${(props) => props.color};
`;

const Zero = styled.Text`
	font-family: ${fonts.normal};
	font-size: 16;
	color: ${colors.black};
	flex: 1;
	align-self: flex-start;
`;

const GoalAmount = styled.Text`
	font-family: ${fonts.normal};
	font-size: 16;
	color: ${colors.black};
	flex: 1;
	align-self: flex-end;
	text-align: right;
`;

const Participants = styled.Text`
	font-family: ${fonts.normal};
	font-size: 13;
	color: ${colors.grey1};
`;

const QuestionBlock = styled.View`
	margin-bottom: 35;
`;

const QuestionTitle = styled.Text`
	font-family: ${fonts.normal};
	font-size: 16;
	color: ${colors.black};
`;

const QuestionInput = styled.TextInput`
	height: 50;
	border: 1px solid ${colors.grey2};
	border-radius: 5px;
	padding: 10px;
	background-color: ${colors.white};
`;

const ButtonWrapper = styled.TouchableHighlight`
	width: 100;
	height: 25px;
	border-radius: 25px;
	background-color: ${(props) => props.bg};
	justify-content: center;
	align-items: center;
	margin-right: 10;
`;

const ButtonText = styled.Text`
	font-size: 13;
	color: ${(props) => props.color};
	font-family: ${fonts.normal};
	margin: 0;
	margin-top: 1px;
`;

const menus = ['YOUR GOALS', 'SET A GOAL'];

const percentage = (current, total) => (current / total) * 100;

// reference https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
const currencyFormat = (num) => {
	return Math.abs(num) > 999
		? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
		: Math.sign(num) * Math.abs(num);
};

const terms = [
	{ label: 'Week', value: 0 },
	{ label: 'Month', value: 1 },
	{ label: 'Year', value: 2 }
];

const weeks = [
	{ label: '1', value: 1 },
	{ label: '2', value: 2 },
	{ label: '3', value: 3 },
	{ label: '4', value: 4 }
];

const months = [
	{ label: '1', value: 1 },
	{ label: '2', value: 2 },
	{ label: '3', value: 3 },
	{ label: '4', value: 4 },
	{ label: '5', value: 5 },
	{ label: '6', value: 6 },
	{ label: '7', value: 7 },
	{ label: '8', value: 8 },
	{ label: '9', value: 9 },
	{ label: '10', value: 10 },
	{ label: '11', value: 11 },
	{ label: '12', value: 12 }
];

const goalPurpose = (value) => {
	switch (value) {
		case 0:
			return 'Buying House';
		case 1:
			return 'Holidays';
		case 2:
			return 'Family Plan';
		case 3:
			return 'Saving Money';
		default:
	}
};

const purposeColor = (value) => {
	switch (value) {
		case 0:
			return `${colors.green}`;
		case 1:
			return `${colors.red}`;
		case 2:
			return `${colors.blue2}`;
		case 3:
			return `${colors.blue1}`;
		default:
	}
};

function Goals({
	navigation,
	user,
	today,
	goals,
	participants,
	savings,
	updateData,
}) {
	const [active, setActive] = useState(0);
	const [isJoint, setJoint] = useState(false);
	const [isDisabled, setDisable] = useState(true);

	const [purpose, setPurpose] = useState(0);
	const [amount, setAmount] = useState(null);
	const [unit, setUnit] = useState(0);
	const [period, setPeriod] = useState(0);
	const [joint, setMember] = useState([]);

	const handleActive = (param) => setActive(param);

	useEffect(() => {
		if (amount !== null && period > 0) {
			setDisable(false);
		}
	}, [isDisabled, amount, period]);

	const dues = savings.map((saving) => saving.due_date);
	const units = dues.map((due) => Object.keys(due));

	const contents = {
		purpose: purpose,
		amount: +amount,
		unit: unit,
		period: period,
		joint_members: joint,
		user_id: user.id,
	};

	const postRequestOption = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(contents)
	};

	const handlePostGoal = async () => {
		await fetch(`${API_URL}/api/goals`, postRequestOption)
			.then((response) => response.json())
			.then((result) => {
				let message;
				result.success === true
					? (message = result.messages)
					: (message = 'There was an error. Try again!');
				Alert.alert(
					'Setting a new saving goal',
					`${message}`,
					[
						{
							text: 'OK',
							onPress: () => {
								if (result.success === true) {
									setPurpose(0);
									setAmount(null);
									setUnit(0);
									setPeriod(0);
									setMember([]);
								}
							},
						},
					],
					{ cancelable: false }
				);
				updateData(user.id);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<SubLayout title="Saving Goals" prev={navigation}>
			<StateContext.Provider value={menus}>
				<Tab handleActive={handleActive} active={active} />
			</StateContext.Provider>
			{active === 0 && (
				<ScrollView>
					<View style={{ margin: 20 }}>
						{goals &&
							goals.map((goal, idx) => (
								<ScreenLayout
									key={savingPurpose[idx].label}
									category="Saving">
									<PeriodWrapper>
										<Period>Due in</Period>
										<Period>
											{savings[idx].due_date[units[idx]] +
												units[idx]}
										</Period>
									</PeriodWrapper>
									<PurposeWrapper>
										<SAVING_ICON
											fill={purposeColor(goal.purpose)}
										/>
										<Purpose
											color={purposeColor(goal.purpose)}>
											{goalPurpose(goal.purpose)}
										</Purpose>
									</PurposeWrapper>
									<BarWrapper>
										<FullBar>
											<CurrentBar
												color={purposeColor(
													goal.purpose
												)}
												width={
													percentage(
														savings[idx]
															.current_saving,
														goal.amount
													) + '%'
												}
											/>
										</FullBar>
										<View style={{ flexDirection: 'row' }}>
											<Zero>0</Zero>
											<GoalAmount>
												{currencyFormat(goal.amount)}
											</GoalAmount>
										</View>
									</BarWrapper>
									{goal.joint_members.length > 0 && (
										<Participants>
											OTHER SAVERS
										</Participants>
									)}
									<View
										style={{
											width: '100%',
											flexDirection: 'row',
										}}>
										{goal.joint_members.length > 0 &&
											goal.joint_members.map(
												(item, idx) => (
													<TagBG
														key={participants[idx]}>
														<TagText>
															{participants[
																idx
															].nickname.toUpperCase()}
														</TagText>
													</TagBG>
												)
											)}
									</View>
								</ScreenLayout>
							))}
					</View>
				</ScrollView>
			)}
			{/* END OF YOUR GOALS */}
			{/* START OF SET A GOAL */}
			{active === 1 && (
				<ScrollView style={{ paddingBottom: 50 }}>
					<View style={{ margin: 20 }}>
						<QuestionBlock>
							<QuestionTitle>
								What is this saving for?
							</QuestionTitle>
							<DropDownPicker
								items={savingPurpose}
								defaultValue={savingPurpose[0].value}
								containerStyle={{ height: 50 }}
								style={{ backgroundColor: '#fafafa' }}
								itemStyle={{
									justifyContent: 'flex-start',
									paddingLeft: 10,
								}}
								dropDownStyle={{
									backgroundColor: `${colors.white}`
								}}
								activeItemStyle={{
									backgroundColor: `${colors.grey4}`
								}}
								onChangeItem={(item, idx) => setPurpose(idx)}
							/>
						</QuestionBlock>
						<QuestionBlock>
							<QuestionTitle>
								How much do you want to save?
							</QuestionTitle>
							<QuestionInput
								defaultValue="0"
								keyboardType="numeric"
								onChangeText={(text) => setAmount(text)}
								value={amount}
							/>
						</QuestionBlock>
						<QuestionBlock>
							<QuestionTitle>
								How long do you want to save?
							</QuestionTitle>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<DropDownPicker
									items={terms}
									defaultValue={terms[0].value}
									containerStyle={{
										height: 50,
										width: 170,
										marginRight: 10
									}}
									style={{ backgroundColor: '#fafafa' }}
									itemStyle={{
										justifyContent: 'flex-start',
									}}
									dropDownStyle={{
										backgroundColor: `${colors.white}`
									}}
									activeItemStyle={{
										backgroundColor: `${colors.grey4}`
									}}
									onChangeItem={(item, idx) => setUnit(idx)}
								/>
								{unit === 0 && (
									<DropDownPicker
										items={weeks}
										defaultValue={weeks[0].value}
										containerStyle={{
											height: 50,
											width: 170
										}}
										style={{ backgroundColor: '#fafafa' }}
										itemStyle={{
											justifyContent: 'flex-start',
										}}
										dropDownStyle={{
											backgroundColor: `${colors.white}`
										}}
										activeItemStyle={{
											backgroundColor: `${colors.grey4}`,
										}}
										onChangeItem={(item) =>
											setPeriod(item.value)
										}
									/>
								)}
								{unit !== 0 && (
									<DropDownPicker
										items={months}
										defaultValue={months[0].value}
										containerStyle={{
											height: 50,
											width: 170
										}}
										style={{ backgroundColor: '#fafafa' }}
										itemStyle={{
											justifyContent: 'flex-start',
										}}
										dropDownStyle={{
											backgroundColor: `${colors.white}`
										}}
										activeItemStyle={{
											backgroundColor: `${colors.grey4}`
										}}
										onChangeItem={(item) =>
											setPeriod(item.value)
										}
									/>
								)}
							</View>
						</QuestionBlock>
						<QuestionBlock>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<QuestionTitle>
									Have you set the goal jointly?
								</QuestionTitle>
								<ToggleSwitch
									isOn={isJoint}
									onColor={colors.blue3}
									offColor={colors.grey2}
									size="medium"
									onToggle={(isOn) => setJoint(!isJoint)}
								/>
							</View>
							{isJoint && (
								<View
									style={{
										width: '100%',
										marginTop: 20,
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									{participants.length > 0 &&
										participants.map((participant, idx) => (
											<ButtonWrapper
												key={participant.nickname}
												bg={
													joint.includes(
														participant.joint_member_id
													)
														? `${colors.blue3}`
														: `${colors.grey2}`
												}
												onPress={() => {
													if (
														joint.includes(
															participant.joint_member_id
														)
													) {
														setMember(
															joint.filter(
																(person) =>
																	person !==
																	participant.joint_member_id
															)
														);
													} else if (
														!joint.includes(
															participant.joint_member_id
														)
													) {
														setMember([
															...joint,
															participant.joint_member_id,
														]);
													}
												}}>
												<ButtonText
													color={
														joint.includes(idx)
															? `${colors.blue1}`
															: `${colors.white}`
													}>
													{participant.nickname.toUpperCase()}
												</ButtonText>
											</ButtonWrapper>
										))}
								</View>
							)}
						</QuestionBlock>
						<ConfirmButton
							isDisabled={isDisabled}
							handleEvent={handlePostGoal}
						/>
					</View>
				</ScrollView>
			)}
		</SubLayout>
	);
}

function mapStateToProps(state) {
	const { user, today, goals, participants, savings } = state.authentication;
	return { user, today, goals, participants, savings };
}

const mapDispatchToProps = (dispatch) => ({
	updateData: (goal) => dispatch(updateActions.updateGoal(goal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Goals);
