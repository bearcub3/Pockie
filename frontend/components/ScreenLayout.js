import React from 'react';
import { View, Text, Image } from 'react-native';
import styled from "emotion-native-extended";

import { colors, fonts } from '../utils/theme';

const Container = styled.View`
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${colors.grey2};
    margin-bottom: 15px;
    padding: 15px;
`

const Your = styled.Text`
    font-family: ${fonts.main};
    font-size: 13px;
`

const Title = styled.Text`
    font-family: ${fonts.main};
    font-size: 20px;
    margin-top: -12;
    letter-spacing: -0.3;
`

export default function ScreenLayout({ category, children }) {
    return (
        <Container>
            <Your>Your</Your>
            <Title>{category}</Title>
            <View style={{ margin: 0 }}>
                {children}
            </View>
        </Container>
    )
}