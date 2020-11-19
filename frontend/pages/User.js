import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import styled from "emotion-native-extended";
import ToggleSwitch from 'toggle-switch-react-native'
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts } from '../utils/theme';
import Layout from '../components/Layout';
import Todays from '../components/Todays';
import AssetBox from '../components/AssetBox';

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
    marginTop: -120,
}

const userData = {
    'first_name': 'Aimee',
    'joint': false,
    'participants': [],
    'currency': false
}

const userFinanceData = {
    expense: 503.65,
    income: 0,
    currentRate: 1500,
}

// TODO: modelling the expense API /api/expense/:id  'GET'
// probably retrieving data from api up to 6 months from today
// retrieve all the expense data filtered by the date which meets the condition above
// aggregate the data based on each expense key value
// sum up the total expenses of the total 6 months
// sum up the total expenses of each category
// calculate the percentage of expense

const userExpenseData = {
    'House, Bills, Taxes': 50,
    'Grocery': 15,
    'Shopping': 5,
    'Entertainment': 10,
    'Transportation, Car': 4,
    'Healthcare': 3,
    'Personal': 10, 
    'Etc': 3
}

const WaveEmoji = () => (
    <Image source={require('../assets/images/handIcon.png')} style={{ position: `absolute`, right: -50, top: -5 }} role="img" />
)

const Settings = () => (
    <View style={{ alignItems: `center`, justifyContent: `center`, width: 30, height: 30, borderRadius: 30, backgroundColor: `${colors.white}`}}>
        <Ionicons name="md-settings" size={24} color={colors.grey1} />
    </View>
)

const conversion = (value) => {
    if(!userData.currency) {
        let result = value * userFinanceData.currentRate;
        // TO-DO: toLocaleString doesn't work on React Native. need to find a way to work around
        return result;
    }
}

export default function User(){
    const [currencyChanged, setConversion] = useState(userData.currency);
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
                <View style={{ flex: 1, position: `absolute`, top: 33, right: 20 }}>
                    <Settings />
                </View>
            </ProfileHeader>
            <Layout>
                <View style={{ marginBottom: 20, alignItems: `center`}} >
                    <Image source={require('../assets/images/avatar.png')} style={image} />
                    <View style={{ position: `relative` }}><UserName>{`Hello, ${userData.first_name}!`}</UserName><WaveEmoji /></View>
                </View>
                <View style={{ flexDirection: `row` }}>
                    <View style={{ flexDirection: `column`, width: `48.5%`, marginRight: 10 }}>
                        <Todays title="Expense" amount={userFinanceData.expense} conversion={conversion(userFinanceData.expense)} />
                    </View> 
                    <View style={{ flexDirection: `column`, width: `48.5%` }}>
                        <Todays title="Income" amount={userFinanceData.income} conversion={conversion(userFinanceData.income)} />
                    </View>
                </View>
                <AssetBox category="Spending Pattern">
                    <Text>hello</Text>
                </AssetBox>
            </Layout>
        </>
    )
}