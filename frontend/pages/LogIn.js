import React, { useState } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import styled from "emotion-native-extended"

import { userActions } from '../actions'

import { colors, fonts } from '../utils/theme';
import Layout from '../components/Layout'
import Header from '../components/Header'

const Row = styled.View`
    flex: 1;
    margin-top: 15px;
    margin-bottom: 15px;
    justify-content: flex-end;
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

export default function LogIn(){    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <Layout>
            <Header title="Log In" />
            <Row>
                <Label>Email Address</Label>
                <Input onChangeText={(text) => setEmail(text)} value={email} style={{ marginBottom: 20}} />

                <Label>Password</Label>
                <Input onChangeText={(text) => setPassword(text)} value={password} />
            </Row>

            <Row>
                <Button bgcolor={colors.blue2}>
                    <ButtonText color={colors.white}>LOG IN</ButtonText>
                </Button>
            </Row>
        </Layout>
    )
}