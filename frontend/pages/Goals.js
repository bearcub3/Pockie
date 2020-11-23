import React, { useState, useContext, useEffect } from 'react';
import { Image, ScrollView, View, Text, TouchableHighlight, TextInput } from 'react-native';

import styled from "emotion-native-extended";

import { colors, fonts, TagBG, TagText } from '../utils/theme';
import SubLayout from '../components/SubLayout';

import StateContext from '../context/StateContext';

import Tab from '../components/Tab';
import ScreenLayout from '../components/ScreenLayout';

import DropDownPicker from 'react-native-dropdown-picker';
import ToggleSwitch from 'toggle-switch-react-native';
import SaveButton from '../components/SaveButton';

const PeriodWrapper = styled.View`
    position: absolute;
    margin-top: -45;
    right: 0;
`

const Period = styled.Text`
    font-family: ${fonts.main};
    font-size: 13;
    color: ${colors.black};
    
    &::first-of-type {
        margin-bottom: -5;
    }
`

const PurposeWrapper = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 35px;
`

const Purpose = styled.Text`
    color: ${colors.green};
    font-family: ${fonts.main};
    font-size: 24;
`

const BarWrapper = styled.View`
    justify-content: center;
    align-items: center;
`

const FullBar = styled.View`
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: ${colors.grey3};
`

const CurrentBar = styled.View`
    width: ${props => props.percentage};
    height: 10px;
    border-radius: 5px;
    background-color: ${colors.green};
`

const Zero = styled.Text`
    font-family: ${fonts.normal};
    font-size: 16;
    color: ${colors.black};
    flex: 1;
    align-self: flex-start;
`

const GoalAmount = styled.Text`
    font-family: ${fonts.normal};
    font-size: 16;
    color: ${colors.black};
    flex: 1;
    align-self: flex-end;
    text-align: right;
`

const Participants = styled.Text`
    font-family: ${fonts.normal};
    font-size: 13;
    color: ${colors.grey1};
`

const QuestionBlock = styled.View`
    margin-bottom: 35;
`

const QuestionTitle = styled.Text`
    font-family: ${fonts.normal};
    font-size: 16;
    color: ${colors.black};
`

const QuestionInput = styled.TextInput`
    height: 50;
    border: 1px solid ${colors.grey2};
    border-radius: 5px;
    padding: 10px;
    background-color: ${colors.white};
`

const ButtonWrapper = styled.TouchableHighlight`
    width: 100;
    height: 25px;
    border-radius: 25px;
    background-color: ${props => props.bg};
    justify-content: center;
    align-items: center;
    margin-right: 10;
`

const ButtonText = styled.Text`
    font-size: 13;
    color: ${props => props.color};
    font-family: ${fonts.normal};
    margin: 0;
    margin-top: 1px;
`

const menus = ['YOUR GOALS', 'SET A GOAL'];

// TODO: getting goalsData using mapsToProps from User.js
const goalsData = [
    { purpose : 'Personal',
      amount : 600,
      current: 260,
      due : '6 months', // not sure about the data format
      partner : []
    },
    { purpose : 'Buying a house',
      amount : 5000,
      current: 1580,
      due : '12 months', // not sure about the data format
      partner: ['PARTNER', 'MUM']
    },
]

const image = {
    width: 71,
    height: 47,
    marginRight: 10,
}


const percentage = (current, total) => current/total * 100;

// reference https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
const currencyFormat = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

// TODO: create a list of the reasons for saving goal
// either just from frontend and to save it as a string to backend
// or retrieve the list from backend and save it as a index(number)
const reasons = [{ label: 'Buying a house', value: 'Buying a house' }, {label: 'For holidays', value: 'For holidays'}, {label: 'Family plan', value: 'Family plan'}, {label: 'Saving money', value: 'Saving money'}];

// TODO: getting all joint account information using mapStateToProps
const joints = ['Partner', 'Sister', 'Mother'];


const terms = [{ label: 'Week', value: 'Week' }, { label: 'Month', value: 'Month' }, { label: 'Year', value: 'Year' }];
const weeks = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }];
const months = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '10', value: '10' }, { label: '11', value: '11' }, { label: '12', value: '12' }];

export default function Goals({ navigation }){
    const [active, setActive] = useState(0);
    const [reason, setReason] = useState(0);
    const [term, setTerm] = useState(0);
    const [howLong, setPeriod] = useState(0);
    const [isJoint, setJoint] = useState(false);
    const [joint, setMember] = useState([]);

    const handleActive = (param) => setActive(param);

    useEffect(() => {
        console.log(joint)
    }, [joint])
    return (
        <SubLayout title="Saving Goals" prev={navigation}>
            <StateContext.Provider value={menus}>
                <Tab handleActive={handleActive} active={active} />
            </StateContext.Provider>
                {active === 0 && (   
                    <ScrollView>
                        <View style={{ margin: 20 }}>
                            {goalsData.map(((goal, idx) => (
                                <ScreenLayout key={goal.purpose} category="Saving">
                                    <PeriodWrapper>
                                        <Period>Due in</Period>
                                        <Period>{goal.due}</Period>
                                    </PeriodWrapper>
                                    <PurposeWrapper>
                                        <Image source={require('../assets/images/saving_icon.png')} style={image} />
                                        <Purpose>{goal.purpose.toUpperCase()}</Purpose>
                                    </PurposeWrapper>
                                    <BarWrapper>
                                        <FullBar>
                                            <CurrentBar width={percentage(goal.current, goal.amount) + `%`} />
                                        </FullBar>
                                        <View style={{ flexDirection: `row` }}>
                                            <Zero>0</Zero>
                                            <GoalAmount>{currencyFormat(goal.amount)}</GoalAmount>
                                        </View>
                                    </BarWrapper>
                                    {goal.partner.length > 0 && (
                                        <Participants>OTHER SAVERS</Participants>
                                    )}
                                    <View style={{ width: `100%`, flexDirection: `row` }}>
                                    {goal.partner.length > 0 && goal.partner.map((item) => (<TagBG key={item}><TagText>{item}</TagText></TagBG>))}
                                    </View>
                                </ScreenLayout>
                            )))}
                        </View>
                    </ScrollView>
                )}
            {active === 1 && (
                <ScrollView style={{ paddingBottom: 50 }}>
                    <View style={{ margin: 20 }}>
                        <QuestionBlock>
                            <QuestionTitle>Why do you want to set a goal?</QuestionTitle>
                            <DropDownPicker
                                items={reasons}
                                defaultValue={reasons[0].value}
                                containerStyle={{height: 50}}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: `${colors.white}`}}
                                onChangeItem={(item,idx) => setReason(idx)}
                            />
                        </QuestionBlock>
                        <QuestionBlock>
                            <QuestionTitle>How much do you want to save?</QuestionTitle>
                            <QuestionInput defaultValue="0" keyboardType="numeric" />
                        </QuestionBlock>
                        <QuestionBlock>
                            <QuestionTitle>How long do you want to save?</QuestionTitle>
                            <View style={{ flexDirection: `row`, justifyContent: `space-between`}}>
                                <DropDownPicker
                                    items={terms}
                                    defaultValue={terms[0].value}
                                    containerStyle={{height: 50, width: 170, marginRight: 10}}
                                    style={{backgroundColor: '#fafafa'}}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{backgroundColor: `${colors.white}`}}
                                    onChangeItem={(item,idx) => setTerm(idx)}
                                />
                                {term === 0 && (
                                    <DropDownPicker
                                        items={weeks}
                                        defaultValue={weeks[0].value}
                                        containerStyle={{height: 50, width: 170}}
                                        style={{backgroundColor: '#fafafa'}}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: `${colors.white}`}}
                                        onChangeItem={(idx) => setPeriod(idx)}
                                    />
                                )}
                                {term !== 0 && (
                                    <DropDownPicker
                                        items={months}
                                        defaultValue={months[0].value}
                                        containerStyle={{height: 50, width: 170}}
                                        style={{backgroundColor: '#fafafa'}}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{backgroundColor: `${colors.white}`}}
                                        onChangeItem={(idx) => setPeriod(idx)}
                                    />
                                )}
                            </View>
                        </QuestionBlock>
                        <QuestionBlock>
                            <View style={{ flexDirection: `row`, justifyContent: `space-between`}}>
                                <QuestionTitle>Have you set the goal jointly?</QuestionTitle>
                                <ToggleSwitch
                                    isOn={isJoint}
                                    onColor={colors.blue3}
                                    offColor={colors.grey2}
                                    size="medium"
                                    onToggle={isOn => setJoint(!isJoint)}
                                />
                            </View>
                            {isJoint && (
                                <View style={{ width: `100%`, marginTop: 20, flexDirection: `row`, justifyContent: `space-between` }}>
                                    {joints.length > 0 && joints.map((item, idx) => (
                                        <ButtonWrapper key={item} bg={joint.includes(idx) ? `${colors.blue3}`: `${colors.grey2}`} onPress={() => {
                                            if(joint.includes(idx)) {
                                                setMember(joint.filter((item) => item !== idx));
                                            } else if(!joint.includes(idx)) {
                                                setMember([...joint, idx]);
                                            }
                                        }}>
                                            <ButtonText color={joint.includes(idx) ? `${colors.blue1}` : `${colors.white}`}>{item.toUpperCase()}</ButtonText>
                                        </ButtonWrapper>
                                    ))}
                                </View>
                            )}
                        </QuestionBlock>
                        <SaveButton />
                    </View>
                </ScrollView>
            )}
        </SubLayout>
    )
}