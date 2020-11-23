import styled from "emotion-native-extended";

export const colors = {
    blue1: '#076eda',
    blue2: '#63a8f1',
    blue3: '#b6dbff',
    red: '#ff5247',
    green: '#04bb00',
    black: '#242424',
    white: '#fff',
    grey1: '#797979',
    grey2: '#dcdcdc',
    grey3: '#e5e5e5',
    grey4: '#efefef'
};

export const fonts = {
    main: 'Poppins_600SemiBold',
    normal: 'Poppins_500Medium',
    plain: 'Roboto_400Regular'
}

export const chart = {
    color1: '#076eda',
    color2: '#fD6585',
    color3: '#ff5247',
    color4: '#04bb00',
    color5: '#51c0bf',
    color6: '#9467db',
    color7: '#ffb529',
    color8: '#ffdd00'
}

export const TagBG = styled.View`
    width: 100;
    height: 25px;
    border-radius: 25px;
    background-color: ${colors.blue3};
    justify-content: center;
    align-items: center;
    margin-right: 10;
`

export const TagText = styled.Text`
    font-size: 13;
    color: ${colors.blue1};
    font-family: ${fonts.normal};
    margin: 0;
`