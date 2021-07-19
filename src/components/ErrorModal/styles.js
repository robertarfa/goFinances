import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    background-color: #e52b2b;
    height: ${RFValue(100)}px;
    justify-content: center;
    align-items: center;
`;

export const Text = styled.Text`
    font-size: ${RFValue(18)}px;
    color: white;
    padding: 10px;
`;
