import React, { useState, useEffect } from 'react';
import {
	View,
	Image,
	ScrollView,
	TouchableHighlight,
	Text,
	Alert,
} from 'react-native';
import styled from 'emotion-native-extended';
import { connect } from 'react-redux';

import { Ionicons, AntDesign } from '@expo/vector-icons';
import { VictoryPie } from 'victory-native';

import {
	colors,
	fonts,
	Button,
	ButtonText,
	TagBG,
	TagText
} from '../utils/theme';
import { expenseTypes } from '../utils/helper';
import Layout from '../components/Layout';
import Todays from '../components/Todays';
import ScreenLayout from '../components/ScreenLayout';

import { MaterialIcons } from '@expo/vector-icons';
import { userActions } from '../actions';
import { RNS3 } from 'react-native-aws3';
import {
	AWS_ACCESS_KEY,
	AWS_SECRET_KEY,
	S3_BUCKET,
	AWS_REGION,
	API_URL
} from '@env';
import { launchImageLibrary } from 'react-native-image-picker';

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

const userFinanceData = {
	currentRate: 1472.03
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

function ImageWrapper({ children, userId, handleUserProfile, picture }) {
	const options = {
		keyPrefix: 'uploads/',
		bucket: `${S3_BUCKET}`,
		region: `${AWS_REGION}`,
		accessKey: `${AWS_ACCESS_KEY}`,
		secretKey: `${AWS_SECRET_KEY}`,
		successActionStatus: 201,
	};

	const uploadImage = () => {
		launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				Alert.alert(
					'Personal Image Upload',
					`${response.error}`,
					[{ text: 'OK', onPress: () => console.log('OK Pressed') }],
					{ cancelable: false }
				);
			} else {
				const source = {
					uri: response.uri,
					name: response.fileName,
					type: response.type,
				};

				return RNS3.put(source, options).then((res) => {
					if (res.status !== 201) {
						Alert.alert(
							'Personal Image Upload',
							'Failed to upload image to S3',
							[
								{
									text: 'OK',
									onPress: () => console.log('OK Pressed'),
								},
							],
							{ cancelable: false }
						);
						throw new Error('Failed to upload image to S3');
					}

					const content = {
						user_id: userId,
						user_picture: res.body.postResponse.location
					};

					const postRequestOption = {
						method: picture !== undefined ? 'PATCH' : 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(content)
					};

					handleUserPicture();

					async function handleUserPicture() {
						await fetch(
							`${API_URL}/api/user/image`,
							postRequestOption
						)
							.then((response) => response.json())
							.then((result) => {
								let message;
								result.success === true
									? (message = result.messages)
									: (message =
											'There was an error. Try again!');

								Alert.alert(
									"User's Profile Picture",
									`${message}`,
									[
										{
											text: 'OK',
											onPress: () => console.log('ok')
										}
									],
									{ cancelable: false }
								);
								handleUserProfile(userId);
							})
							.catch((error) => {
								console.error('Error:', error);
							});
					}
				});
			}
		});
	};
	return (
		<TouchableHighlight onPress={uploadImage}>
			<>
				<View
					style={{
						backgroundColor: colors.grey4,
						width: 34,
						height: 34,
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 32,
						position: 'absolute',
						left: 100,
						top: 80,
						zIndex: 10
					}}>
					<MaterialIcons
						name="add-a-photo"
						size={20}
						color={colors.black}
					/>
				</View>
				<View
					style={{
						width: 130,
						height: 130,
						borderRadius: 130,
						borderWidth: 5,
						borderColor: colors.white,
						justifyContent: 'center',
						alignItems: 'center',
						position: 'relative',
						zIndex: 0,
						backgroundColor: colors.blue2,
					}}>
					{children}
				</View>
			</>
		</TouchableHighlight>
	);
}

const image = {
	width: 100,
	height: 100
};

function Profile({
	navigation,
	user,
	picture,
	today,
	goals,
	participants,
	savings,
	pattern,
	handleUserProfile,
	loadingState,
}) {
	const goToSettings = () => navigation.navigate('Settings');
	const goToGoals = () => navigation.navigate('Goals');
	const [totalExpense, setTotalExpense] = useState(0);
	const [spendingPattern, setSpendingPattern] = useState(null);

	useEffect(() => {
		if (pattern) {
			const totalMedium = Object.entries(pattern).filter(
				([key, value]) => key === 'total_expense'
			);
			const totalExpense = totalMedium.flatMap((item) => item)[1];
			setTotalExpense(totalExpense);

			let percentages = Object.entries(
				pattern
			).map(([key, value], idx) => [
				key === 'total_expense' ? key : expenseTypes[idx].label,
				((value / totalExpense) * 100).toFixed(1),
			]);

			const final = percentages.map((item) => ({
				x: item[0],
				y: +item[1]
			}));

			setSpendingPattern(final.slice(0, -1));
		}
	}, [pattern]);

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
					zIndex: -1
				}}>
				{user && (
					<ImageWrapper
						handleUserProfile={handleUserProfile}
						userId={user.id}
						picture={picture}>
						{picture !== undefined && (
							<Image
								source={{
									uri: picture.user_picture.user_picture
								}}
								style={image}
							/>
						)}
						{picture === undefined ||
							(!picture.success && (
								<View
									style={{
										flexDirection: 'row'
									}}>
									<Text
										style={{
											color: colors.white,
											fontFamily: fonts.normal,
											fontSize: 40,
											marginTop: -80
										}}>
										{user.name.first_name
											.slice(0, 1)
											.toUpperCase()}
									</Text>
									<Text
										style={{
											color: colors.white,
											fontFamily: fonts.normal,
											fontSize: 40,
											marginTop: -80
										}}>
										{user.name.last_name
											.slice(0, 1)
											.toUpperCase()}
									</Text>
								</View>
							))}
					</ImageWrapper>
				)}
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
					{spendingPattern && spendingPattern.length > 0 ? (
						<>
							<View style={{ position: 'relative', left: -35 }}>
								<VictoryPie
									colorScale={'qualitative'}
									innerRadius={30}
									labelRadius={({ innerRadius }) =>
										innerRadius + 15
									}
									data={spendingPattern}
									labelPlacement="parallel"
									style={{
										labels: {
											fill: 'white',
											fontSize: 12
										},
									}}
								/>
							</View>
							<Text style={{ color: colors.grey1 }}>
								This pattern indicates your previous month's
								total expense.
							</Text>
						</>
					) : (
						<>
							<View style={{ alignItems: 'center' }}>
								<Image
									style={{ width: 250, height: 250 }}
									source={require('../assets/images/sample-piechart.png')}
								/>
								<Text style={{ color: colors.grey1 }}>
									Thank you for joinging us! This is a sample
									chart. Once you started using Pockie over a
									month, you can check your spending pattern
									based on your data.
								</Text>
							</View>
						</>
					)}
				</ScreenLayout>
				{/* saving goals */}
				<ScreenLayout category="Saving Goals">
					<PlainText>
						You have <Goals>{(goals && goals.length) || '0'}</Goals>{' '}
						saving goal
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
	const {
		user,
		today,
		goals,
		participants,
		savings,
		pattern,
		picture,
		loadingState,
	} = state.authentication;

	return {
		user,
		today,
		goals,
		participants,
		savings,
		pattern,
		picture,
		loadingState,
	};
}

const mapDispatchToProps = (dispatch) => ({
	handleUserProfile: (id) =>
		dispatch(userActions.updateUserProfilePicture(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
