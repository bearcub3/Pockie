import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import styled from "emotion-native-extended";
import ToggleSwitch from 'toggle-switch-react-native'
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../utils/theme';
import Layout from '../components/Layout'

const ProfileHeader = styled.View`
    height: 190;
    background-color: ${colors.blue3};
    align-items: center;
`

const UserName = styled.Text`
    font-family: ${fonts.main};
    font-size: 20;
`

const image = {
    width: 130,
    height: 130,
    marginTop: 120,
}

const userMockData = {
    'first_name': 'Aimee',
    'joint': false,
    'participants': [],
    'currency': false
}

const WaveEmoji = () => (
    <Image source={require('../assets/images/handIcon.png')} style={{ position: `absolute`, right: -50, top: -5 }} role="img" />
)

const Settings = () => (
    <View style={{ alignItems: `center`, justifyContent: `center`, width: 30, height: 30, borderRadius: 30, backgroundColor: `${colors.white}`}}>
        <Ionicons name="md-settings" size={24} color={colors.grey1} />
    </View>
)

export default function User(){
    const [currencyChanged, setConversion] = useState(userMockData.currency);
    return (
        <>
        <ProfileHeader>
            <View style={{ flex: 1, position: `absolute`, top: 40, left: -10}}>
                <ToggleSwitch
                    isOn={currencyChanged}
                    onColor={colors.blue1}
                    offColor={colors.blue2}
                    label={currencyChanged? '£' : '₩'}
                    labelStyle={currencyChanged? { color: `${colors.white}`, fontSize: 11, position: `relative`, zIndex: 1, left: 25 } : { color: `${colors.white}`, fontSize: 11, position: `relative`, zIndex: 1, left: 50 }}
                    size="medium"
                    onToggle={isOn => setConversion(!currencyChanged)}
                />
            </View>
            <View style={{ flex: 1, position: `absolute`, top: 33, right: 20}}>
                <Settings />
            </View>
            <Image source={require('../assets/images/avatar.png')} style={image} />
            <View style={{ position: `relative` }}><UserName>{`Hello, ${userMockData.first_name}!`}</UserName><WaveEmoji /></View>
        </ProfileHeader>
        </>
    )
}