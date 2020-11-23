import React, { useState, useContext } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styled from "emotion-native-extended";

import { colors, fonts, chart } from '../utils/theme';
import StateContext from '../context/StateContext';

const TabButton = styled.TouchableHighlight`
    background-color: ${colors.grey2};
    background-color: ${props => props.bgColor};
    width: 50%;
    padding: 10px 0;
`

const TabText = styled.Text`
    color: ${props => props.color};
    text-align: center;
    font-family: ${fonts.normal};
    font-size: 16;
    margin-top: 3px;
`


export default function Tab({ handleActive, active }){
    const tabs = useContext(StateContext);
    return(
        <View style={{ flexDirection: `row`, marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
            {tabs.map((tab, idx) => (
                <TabButton 
                    underlayColor="#cccccc"
                    key={tab} 
                    onPress={() => handleActive(idx)} 
                    name={tab} 
                    bgColor={idx === active && `${colors.red}`} 
                    style={idx === 0 ? { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 } : { borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                    <TabText color={active === idx? `${colors.white}` : `${colors.grey1}`}>{tab}</TabText>
                </TabButton>
            ))}
        </View>
    )
}