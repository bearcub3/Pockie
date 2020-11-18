import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from "emotion-native-extended"

import { colors, fonts } from '../utils/theme';
import Layout from '../components/Layout'

import {
    useFonts,
    Poppins_600SemiBold,
    Poppins_700Bold,
  } from '@expo-google-fonts/poppins';
import { AppLoading } from 'expo';


const Container = styled.View`
    flex: 1;
    align-items: center;
    margin-top: 50px;
`

const Welcome = styled.Text`
    font-family: ${fonts.main};
    font-size: 18px;
    color: ${colors.black};
    margin-bottom: 30px;
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

const image = {
    width: 298,
    height: 210
}


export default function Intro({ navigation }){
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_700Bold
      });
    
      if(!fontsLoaded) {
        return <AppLoading />
      }
    return (
        <Layout>
            <View style={{ height: `70%`}}>
                <Image source={require('../assets/images/initial_context.png')} style={image} />
            </View>
            <Welcome>WELCOME TO POCKIE</Welcome>
            <Button bgcolor={colors.blue2}  onPress={() => navigation.navigate('signup')}>
                <ButtonText color={colors.white}>SIGN UP</ButtonText>
            </Button>
            <Button bgcolor={colors.blue3}  onPress={() => navigation.navigate('login')}>
                <ButtonText color={colors.blue1}>LOG IN</ButtonText>
            </Button>
        </Layout>
    )
}