import React from 'react'

import {
    Container,
    Button,
    Icon,
    Title,
} from './styles'

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
}

interface Props {
    type: 'up' | 'down'
    title: string;
    isActive: boolean;
    onPress: () => void;
}

export function TransactionTypeButton({
    type,
    title,
    isActive,
    ...rest
}: Props) {
    return (

        <Container

            isActive={isActive}
            type={type}
            {...rest}
        >
            <Button
                {...rest}
            >
                <Icon
                    name={icons[type]}
                    type={type}
                />
                <Title>
                    {title}
                </Title>
            </Button>
        </Container>
    )
}
