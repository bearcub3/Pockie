import styled from 'emotion-native-extended';

export const colors = {
	blue1: '#076eda',
	blue2: '#63a8f1',
	blue3: '#b6dbff',
	red: '#ff5247',
	green: '#04bb00',
	black: '#242424',
	white: '#fff',
	grey1: '#797979',
	grey2: '#dcdcdc',
	grey3: '#e5e5e5',
	grey4: '#efefef',
};

export const fonts = {
	main: 'Poppins_600SemiBold',
	normal: 'Poppins_500Medium',
	plain: 'Roboto_400Regular',
};

export const chart = {
	color1: '#076eda',
	color2: '#fD6585',
	color3: '#ff5247',
	color4: '#04bb00',
	color5: '#51c0bf',
	color6: '#9467db',
	color7: '#ffb529',
	color8: '#ffdd00',
};

export const TagBG = styled.View`
	width: 100;
	height: 25px;
	border-radius: 25px;
	background-color: ${colors.blue3};
	justify-content: center;
	align-items: center;
	margin-right: 10;
`;

export const TagText = styled.Text`
	font-size: 13;
	color: ${colors.blue1};
	font-family: ${fonts.normal};
	margin: 0;
`;

export const Welcome = styled.Text`
	font-family: ${fonts.main};
	font-size: 18px;
	color: ${colors.black};
	margin-bottom: 30px;
`;

export const Header = styled.View`
	margin: 30px 0 20px 20px;
`;

export const Title = styled.Text`
	font-family: ${fonts.main};
	font-size: 30;
	margin-top: -15;
`;

export const Row = styled.View`
	flex: 1;
	margin-top: 15px;
	margin-bottom: 15px;
`;

export const Label = styled.Text`
	font-family: ${fonts.main};
	font-size: 16px;
	color: ${colors.black};
`;

export const Input = styled.TextInput`
	border-width: 1px;
	border-color: ${colors.grey3};
	border-radius: 5px;
	padding: 5px 10px;
`;

export const Button = styled.TouchableOpacity`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50;
	border-radius: 5px;
	background-color: ${(props) => props.bgcolor};
	margin-bottom: 15px;
`;

export const ButtonText = styled.Text`
	font-family: ${fonts.main};
	font-size: 18;
	color: ${(props) => props.color};
`;

export const StateTitleText = styled.Text`
	font-family: ${fonts.main};
	font-size: ${(props) => props.size};
	color: ${colors.black};
	margin-top: -10;
	padding: 0;
`;

export const StateNumber = styled.Text`
	font-family: ${fonts.normal};
	font-size: ${(props) => props.size};
	color: ${(props) => props.color};
`;
