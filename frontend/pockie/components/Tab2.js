import React, { useContext } from 'react';
import { View } from 'react-native';
import styled from 'emotion-native-extended';

import { colors, fonts } from '../utils/theme';
import StateContext from '../context/StateContext';

const TabButton = styled.TouchableHighlight`
	background-color: ${colors.grey2};
	background-color: ${(props) => props.bgColor};
	width: 33.33333%;
`;

const TabText = styled.Text`
	color: ${(props) => props.color};
	text-align: center;
	font-family: ${fonts.normal};
	font-size: 16;
	margin-top: 3px;
`;

export default function Tab({ handleActive, active }) {
	const tabs = useContext(StateContext);
	return (
		<View
			style={{
				flexDirection: 'row',
				marginLeft: 20,
				marginRight: 20,
				marginBottom: 20,
				justifyContent: 'center',
			}}>
			<View
				style={{
					backgroundColor: `${colors.grey2}`,
					width: '100%',
					flexDirection: 'row',
					borderRadius: 5,
					padding: 3,
				}}>
				{tabs.map((tab, idx) => (
					<TabButton
						underlayColor="#cccccc"
						key={tab}
						onPress={() => handleActive(idx)}
						name={tab}
						bgColor={idx === active && `${colors.white}`}
						style={
							idx === active && {
								borderRadius: 5,
								elevation: 4,
								shadowOffset: { width: 3, height: 3 },
								shadowRadius: 5
							}
						}>
						<TabText
							color={
								active === idx
									? `${colors.black}`
									: `${colors.grey1}`
							}>
							{tab}
						</TabText>
					</TabButton>
				))}
			</View>
		</View>
	);
}
