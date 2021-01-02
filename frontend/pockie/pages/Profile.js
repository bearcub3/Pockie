import React from 'react';
import { View, Image, ScrollView, TouchableHighlight } from 'react-native';
import styled from 'emotion-native-extended';
import { connect } from 'react-redux';

import { Ionicons, AntDesign } from '@expo/vector-icons';
import { VictoryPie } from 'victory-native';

import {
	colors,
	fonts,
	chart,
	Button,
	ButtonText,
	TagBG,
	TagText
} from '../utils/theme';
import Layout from '../components/Layout';
import Todays from '../components/Todays';
import ScreenLayout from '../components/ScreenLayout';

const ProfileHeader = styled.View`
	height: 190;
	background-color: ${colors.blue3};
	align-items: center;
	z-index: -1;
`;

const UserName = styled.Text`
	font-family: ${fonts.main};
	font-size: 20;
`;

const PlainText = styled.Text`
	font-family: ${fonts.normal};
	font-size: 16;
	color: ${colors.grey1};
	text-align: center;
	padding: 15px 0 0;
`;

const Goals = styled.Text`
	font-family: ${fonts.main};
	font-size: 25;
	color: ${colors.green};
`;

const InviteButton = styled.TouchableHighlight`
	background-color: ${colors.blue1};
	border-radius: 10px;
	width: 30%;
	position: relative;
	top: -40px;
	right: -70%;
`;

const InviteContainer = styled.View`
	flex-direction: row;
	padding: 10px;
	align-items: center;
`;

const InviteText = styled.Text`
	font-family: ${fonts.normal};
	font-size: 14;
	color: ${colors.white};
	margin-left: 10px;
`;

const image = {
	width: 130,
	height: 130,
};

const userFinanceData = {
	currentRate: 1472.03
};

const userExpenseData = {
	'House, Bills, Taxes': 50,
	Grocery: 15,
	Shopping: 5,
	Entertainment: 10,
	'Transportation, Car': 4,
	Healthcare: 3,
	Personal: 10,
	Etc: 3
};

const WaveEmoji = () => (
	<Image
		source={require('../assets/images/handIcon.png')}
		style={{ position: 'absolute', right: -50, top: -5 }}
		role="img"
	/>
);

function Settings({ navigate }) {
	return (
		<TouchableHighlight
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				width: 40,
				height: 40,
				borderRadius: 30,
				backgroundColor: `${colors.white}`,
			}}
			onPress={() => navigate()}>
			<Ionicons name="md-settings" size={25} color={colors.grey1} />
		</TouchableHighlight>
	);
}

const conversion = (value) => {
	let result = (value * userFinanceData.currentRate).toFixed(0);
	// TO-DO: toLocaleString doesn't work on React Native. need to find a way to work around
	return result;
};

function Profile({ navigation, user, today, goals, participants, savings }) {
	const goToSettings = () => navigation.navigate('Settings');
	const goToGoals = () => navigation.navigate('Goals');

	return (
		<ScrollView style={{ backgroundColor: `${colors.white}` }}>
			<ProfileHeader>
				<View
					style={{
						flex: 1,
						position: 'absolute',
						top: 40,
						left: -10
					}}
				/>
				<View
					style={{
						flex: 1,
						position: 'absolute',
						top: 33,
						right: 20
					}}>
					<Settings navigate={goToSettings} />
				</View>
			</ProfileHeader>
			<View
				style={{
					marginTop: -70,
					alignItems: 'center',
					zIndex: -1,
				}}>
				<Image
					source={require('../assets/images/avatar.png')}
					style={image}
				/>
				<View style={{ position: 'relative' }}>
					<UserName>
						{user && `Hello, ${user.name.first_name}!`}
					</UserName>
					<WaveEmoji />
				</View>
			</View>
			<Layout>
				<View style={{ flexDirection: 'row', marginBottom: 15 }}>
					<View
						style={{
							flexDirection: 'column',
							width: '48.5%',
							marginRight: 10
						}}>
						{today && (
							<Todays
								title="Expense"
								amount={today.expenses}
								conversion={conversion(today.expenses)}
							/>
						)}
					</View>
					<View style={{ flexDirection: 'column', width: '48.5%' }}>
						{today && (
							<Todays
								title="Income"
								amount={today.incomes}
								conversion={conversion(today.incomes)}
							/>
						)}
					</View>
				</View>
				{/* spending pattern */}
				<ScreenLayout category="Spending Pattern">
					<View style={{ position: 'relative', left: -35 }}>
						<VictoryPie
							colorScale={[
								`${chart.color1}`,
								`${chart.color2}`,
								`${chart.color5}`,
								`${chart.color4}`,
								`${chart.color6}`,
								`${chart.color7}`,
								`${chart.color3}`,
								`${chart.color8}`
							]}
							innerRadius={30}
							labelRadius={({ innerRadius }) => innerRadius + 10}
							data={[
								{ x: 'House, Bills, Taxes', y: 50 },
								{ x: 'Grocery', y: 15 },
								{ x: 'Shopping', y: 5 },
								{ x: 'Entertainment', y: 10 },
								{ x: 'Transportation, Car', y: 4 },
								{ x: 'Healthcare', y: 3 },
								{ x: 'Personal', y: 10 },
								{ x: 'Etc', y: 3 }
							]}
							labelPlacement="parallel"
							style={{
								labels: { fill: 'white', fontSize: 12 },
							}}
						/>
					</View>
				</ScreenLayout>
				{/* saving goals */}
				<ScreenLayout category="Saving Goals">
					<PlainText>
						You have <Goals>{goals && goals.length}</Goals> saving
						goal
						{goals && goals.length > 1 && 's'}.
					</PlainText>
					<Button bgcolor={colors.green} onPress={goToGoals}>
						<ButtonText color={colors.white}>
							SHOW ME GOALS
						</ButtonText>
					</Button>
				</ScreenLayout>
				{/* finance partner */}
				<ScreenLayout category="Fianace Partner">
					<>
						<InviteButton
							onPress={() =>
								navigation.navigate('Participant', {
									userId: user.id
								})
							}>
							<InviteContainer>
								<AntDesign
									name="addusergroup"
									size={24}
									color={colors.white}
								/>
								<InviteText>INVITE</InviteText>
							</InviteContainer>
						</InviteButton>
						<View style={{ flexDirection: 'row' }}>
							{participants &&
								participants.length > 0 &&
								participants.map((participant, idx) => (
									<TagBG key={participant.nickname}>
										<TagText>
											{participant.nickname.toUpperCase()}
										</TagText>
									</TagBG>
								))}
						</View>
					</>
				</ScreenLayout>
			</Layout>
		</ScrollView>
	);
}

function mapStateToProps(state) {
	const { user, today, goals, participants, savings } = state.authentication;
	return { user, today, goals, participants, savings };
}

export default connect(mapStateToProps)(Profile);
