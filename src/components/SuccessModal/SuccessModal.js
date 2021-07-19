import React, { Component } from 'react';
import { Modal } from 'react-native';

import { Container, Text } from './styles';

export function SuccessModal({ text }) {
    return (
        <Modal transparent>
            <Container>
                <Text>{text}</Text>
            </Container>
        </Modal>
    );
}
