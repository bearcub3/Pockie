import React from 'react';
import styled from 'emotion-native-extended';

import { colors, fonts } from '../utils/theme';

const Button = styled.TouchableOpacity`
	width: 100%;
	height: 50px;
	border-radius: 5px;
	background-color: ${(props) => props.color};
	justify-content: center;
	align-content: center;
`;

const ButtonText = styled.Text`
	font-family: ${fonts.main};
	font-size: 18;
	color: ${colors.white};
	text-align: center;
`;

export default function ConfirmButton({ isDisabled, handleEvent }) {
	return (
		<Button
			onPress={() => handleEvent()}
			disabled={isDisabled}
			color={isDisabled ? `${colors.grey2}` : `${colors.blue1}`}>
			<ButtonText>CONFIRM</ButtonText>
		</Button>
	);
}
