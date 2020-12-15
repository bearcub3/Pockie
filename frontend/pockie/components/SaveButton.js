import React from 'react';
import styled from 'emotion-native-extended';

import { colors, fonts } from '../utils/theme';

const Button = styled.TouchableHighlight`
	width: 100%;
	height: 50px;
	border-radius: 5px;
	background-color: ${colors.blue1};
	justify-content: center;
	align-content: center;
`;

const ButtonText = styled.Text`
	font-family: ${fonts.main};
	font-size: 18;
	color: ${colors.white};
	text-align: center;
`;

export default function SaveButton() {
	return (
		<Button>
			<ButtonText>SAVE</ButtonText>
		</Button>
	);
}
