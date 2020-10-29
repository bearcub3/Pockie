import React from 'react';
import { Text } from 'react-native';
import styled from "emotion-native-extended"
import { colors, fonts } from '../utils/theme';


const Container = styled.View`
    flex: 1;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 50px;
    background-color: ${colors.white};
`

export default function Layout({ children }){    
    return(
        <Container>{children}</Container>
    )
}