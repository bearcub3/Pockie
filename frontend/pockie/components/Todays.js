import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styled from 'emotion-native-extended';

import { colors, fonts } from '../utils/theme';
import { isNumeric } from '../utils/helper';

const Box = styled.View`
	width: 100%;
	padding: 15px;
	background-color: ${colors.white};
	border-radius: 10px;
	elevation: 2;
`;

const Title = styled.Text`
	font-family: ${fonts.main};
	font-size: 20;
	margin-top: -10;
`;

const Integer = styled.Text`
	font-family: ${fonts.normal};
	font-size: 33;
	letter-spacing: -1;
`;

const Decimal = styled.Text`
	font-family: ${fonts.normal};
	font-size: 20;
	letter-spacing: -1;
`;
const Conversion = styled.Text`
	font-family: ${fonts.plain};
	color: ${colors.grey1};
	text-align: right;
`;

export default function Todays({ title, amount, conversion }) {
	const [integer, setInteger] = useState(null);
	const [decimal, setDecimal] = useState(null);

	useEffect(() => {
		if (amount !== undefined) {
			if (!isNumeric(amount)) {
				const numbers = amount.toString().split('.');
				setInteger(numbers[0]);
				setDecimal(numbers[1]);
			} else {
				setInteger(amount);
			}
		}
	}, [amount]);

	return (
		<Box>
			<Text style={{ fontFamily: `${fonts.main}`, fontSize: 13 }}>
				Today's
			</Text>
			<Title>{title}</Title>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
				}}>
				<Text
					style={
						title === 'Expense'
							? {
									color: `${colors.blue1}`,
									fontFamily: `${fonts.normal}`,
									fontSize: 16,
									marginRight: 5,
							  }
							: {
									color: `${colors.red}`,
									fontFamily: `${fonts.normal}`,
									fontSize: 16,
									marginRight: 5,
							  }
					}>
					£
				</Text>
				<Integer
					style={
						title === 'Expense'
							? { color: `${colors.blue1}` }
							: { color: `${colors.red}` }
					}>
					{integer}
				</Integer>
				<Decimal
					style={
						title === 'Expense'
							? { color: `${colors.blue1}` }
							: { color: `${colors.red}` }
					}>
					{decimal && ` .${decimal}`}
				</Decimal>
			</View>
			<Conversion>₩ {conversion}</Conversion>
		</Box>
	);
}
