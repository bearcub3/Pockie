import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { colors, fonts, chart } from '../utils/theme';
import styled from "emotion-native-extended";
import { AntDesign } from '@expo/vector-icons';

const Header = styled.View`
    margin: 40px 0 20px 20px;
`

const Title = styled.Text`
    font-family: ${fonts.main};
    font-size: 30;
    margin-top: -15;
`

export default function SubLayout({ prev, title, children }){
    return (
        <View style={{ flex: 1 }}>
            <Header>
                <TouchableWithoutFeedback onPress={() => prev.goBack()}>
                    <AntDesign name="arrowleft" size={35} color="black" />
                </TouchableWithoutFeedback>
                <View style={{ marginTop: 50 }}>
                    <Title>Your</Title>
                    <Title>{ title }</Title>
                </View>
            </Header>
            { children }
        </View>
    )
}