import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { userActions } from '../actions'
import styled from "emotion-native-extended"
import ToggleSwitch from 'toggle-switch-react-native'
import * as Localization from 'expo-localization';
import { colors, fonts } from '../utils/theme';

import Layout from '../components/Layout'
import Header from '../components/Header'

const Row = styled.View`
    flex: 1;
    margin-top: 15px;
    margin-bottom: 15px;
`

const Column = styled.View`
    width: 50%;
`

const Label = styled.Text`
    font-family: ${fonts.main};
    font-size: 16px;
    color: ${colors.black};
`

const Input = styled.TextInput`
    border-width: 1px;
    border-color: ${colors.grey3};
    border-radius: 5px;
    padding: 5px 10px;
`

const Button = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50;
    border-radius: 5px;
    background-color: ${(props) => props.bgcolor};
    margin-bottom: 15px;
`

const ButtonText = styled.Text`
    font-family: ${fonts.main};
    font-size: 18;
    color: ${(props) => props.color};  
`


function SignUp({ register, submitted, navigation }){
    const [disabled, setDisabled] = useState(true);
    const [givenName, setGivenName] = useState('');
    const [famName, setFamName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [joint, setJoint] = useState(false);
    const [currency, setCurrency] = useState(false);

    useEffect(() => {
        const locale = Localization.locale;
        locale === 'en-GB' ? setCurrency(false) : setCurrency(true);
    }, [currency])

    useEffect(() => {
        if(submitted) navigation.navigate('login');
    }, [submitted])

    useEffect(() => {
        if(givenName, famName, email, password, repassword) setDisabled(!disabled);
    }, [givenName, famName, email, password, repassword])

    const handleRegisterUser = () => {
        if(givenName, famName, email, password, repassword) {
            register({
                first_name: givenName,
                last_name: famName,
                email: email,
                password: password,
                dbpassword: repassword,
                participants: [],
                joint: joint,
                currency: currency
            });
        }
    }

    return(
        <Layout>
            <Header title="Sign Up" />
            <Row style={{ flexDirection: `row` }}>
                <Column>
                    <Label>Given Name</Label>
                    <Input onChangeText={(text) => setGivenName(text)} value={givenName} style={{ marginRight: 10 }} />
                </Column>
                <Column>
                    <Label>Family Name</Label>
                    <Input onChangeText={(text) => setFamName(text)} value={famName} />
                </Column>
            </Row>

            <Row>
                <Label>Email Address</Label>
                <Input onChangeText={(text) => setEmail(text)} value={email} />
            </Row>

            <Row>
                <Label>New Password</Label>
                <Input onChangeText={(text) => setPassword(text)} value={password} />
            </Row>

            <Row>
                <Label>Re-enter Password</Label>
                <Input onChangeText={(text) => setRePassword(text)} value={repassword} />
            </Row>

            <Row style={{ flexDirection: `row` }}>
                <Column>
                    <Label>Joint?</Label>
                </Column>
                <Column style={{ alignItems: `flex-end`}}>
                    <ToggleSwitch isOn={joint} onColor={colors.blue3} offColor={colors.grey4} onToggle={(isOn) => setJoint(isOn)} />
                </Column>
            </Row>
            
            {/* {
                joint && (<Row>
                    <Label>Participants</Label>
                    <Input onChangeText={(text) => setPassword(text)} value={password} />
                </Row>)
            } */}

            <Row>
                <Button bgcolor={colors.blue2} disabled={disabled} onPress={() => handleRegisterUser()}>
                    <ButtonText color={colors.white}>CONFIRM</ButtonText>
                </Button>
            </Row>
            
        </Layout>
    )
}

function mapStateToProps(state) {
    const { registering, submitted } = state.registration;
    return { registering, submitted };
}

const actionCreators = {
    register: userActions.register
}

export default connect(mapStateToProps, actionCreators)(SignUp)