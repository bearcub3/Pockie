import React, { useState } from 'react';
import { Text, View, Image, ScrollView, Dimensions, TouchableHighlight } from 'react-native';
import styled from "emotion-native-extended";
import ToggleSwitch from 'toggle-switch-react-native'
import { Ionicons } from '@expo/vector-icons';

import { VictoryPie } from 'victory-native';

import { colors, fonts, chart } from '../utils/theme';
import Layout from '../components/Layout';
import Todays from '../components/Todays';
import ScreenLayout from '../components/ScreenLayout';

const ProfileHeader = styled.View`
    height: 190;
    background-color: ${colors.blue3};
    align-items: center;
    z-index: -1;
`

const UserName = styled.Text`
    font-family: ${fonts.main};
    font-size: 20;
`

const PlainText = styled.Text`
    font-family: ${fonts.normal};
    font-size: 16;
    color: ${colors.grey1};
    text-align: center;
    padding: 15px 0 0;
`

const Goals = styled.Text`
    font-family: ${fonts.main};
    font-size: 25;
    color: ${colors.green};
`

const Button = styled.View`
    border-radius: 5px;
    background-color: ${colors.green};
    padding: 10px;
`

const ButtonText = styled.Text`
    font-family: ${fonts.main};
    font-size: 18;
    text-align: center;
    color: ${colors.white};
`

const image = {
    width: 130,
    height: 130,
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

// TODO: create saving model API /api/goals  'POST', 'GET'
// mapStateToProps 
// saving goals screen => createNativeStackNavigator

const goalsData = [
    { purpose : 'Personal',
      amount : 600,
      current: 260,
      due : '6 months' // not sure about the data format
    },
    { purpose : 'Buying a house',
      amount : 5000,
      current: 1580,
      due : '12 months' // not sure about the data format
    },
]


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

export default function User({ navigation }){
    const [currencyChanged, setConversion] = useState(userData.currency);
    const windowWidth = Dimensions.get('window').width;

    return (
        <ScrollView style={{ backgroundColor: `${colors.white}` }}>
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
            <View style={{ marginTop: -70, alignItems: `center`, zIndex: -1 }} >
                <Image source={require('../assets/images/avatar.png')} style={image} />
                <View style={{ position: `relative` }}><UserName>{`Hello, ${userData.first_name}!`}</UserName><WaveEmoji /></View>
            </View>
            <Layout>
                <View style={{ flexDirection: `row`, marginBottom: 15 }}>
                    <View style={{ flexDirection: `column`, width: `48.5%`, marginRight: 10 }}>
                        <Todays title="Expense" amount={userFinanceData.expense} conversion={conversion(userFinanceData.expense)} />
                    </View> 
                    <View style={{ flexDirection: `column`, width: `48.5%` }}>
                        <Todays title="Income" amount={userFinanceData.income} conversion={conversion(userFinanceData.income)} />
                    </View>
                </View>
                {/* spending pattern */}
                <ScreenLayout category="Spending Pattern">
                    <View style={{ position: `relative`, left: -35 }}>
                        <VictoryPie
                            colorScale={[`${chart.color1}`, `${chart.color2}`, `${chart.color5}`, `${chart.color4}`, `${chart.color6}`, `${chart.color7}`, `${chart.color3}`, `${chart.color8}`]}
                            innerRadius={30}
                            labelRadius={({ innerRadius }) => innerRadius + 10 }
                            data={[
                                { x: 'House, Bills, Taxes', y: 50 },
                                { x: 'Grocery', y: 15 },
                                { x: 'Shopping', y: 5 },
                                { x: 'Entertainment', y:10 },
                                { x: 'Transportation, Car', y: 4 },
                                { x: 'Healthcare', y: 3 },
                                { x: 'Personal', y: 10 },
                                { x: 'Etc', y: 3 } 
                            ]}
                            labelPlacement="parallel"
                            style={{ labels: { fill: "white", fontSize: 12 } }}
                        />
                    </View>
                </ScreenLayout>
                {/* saving goals */}
                <ScreenLayout category="Saving Goals">
                    <PlainText>You have <Goals>{goalsData.length}</Goals> saving goal{goalsData.length > 1 && `s`}.</PlainText>
                    <TouchableHighlight 
                        onPress={() => navigation.navigate('Your Saving Goals')}>
                        <Button>
                            <ButtonText>SET A GOAL</ButtonText>
                        </Button>
                    </TouchableHighlight>
                </ScreenLayout>
                {/* finance partner */}
                <ScreenLayout category="Fianace Partner">
                  
                </ScreenLayout>
            </Layout>
        </ScrollView>
    )
}