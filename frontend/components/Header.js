import React from 'react';
import { View, Text } from 'react-native';
import styled from "emotion-native-extended"
import { colors, fonts } from '../utils/theme';

const HeadTitle = styled.Text`
    font-family: ${fonts.main};
    font-size: 30px;
    color: ${colors.black};
`


export default function Header({ title }){    
    return(
        <View>
            <HeadTitle>{title}</HeadTitle>
        </View>
    )
}