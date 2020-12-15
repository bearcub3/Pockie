import React from 'react';
import styled from 'emotion-native-extended';
import { colors } from '../utils/theme';

const Container = styled.View`
	flex: 1;
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 50px;
	background-color: ${colors.white};
	z-index: -2;
`;

export default function Layout({ children }) {
	return <Container>{children}</Container>;
}
