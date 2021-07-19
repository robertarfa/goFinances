import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper';


import { HighlightCard } from '../../components/HighlightCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard'


import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string,
}

export function Dashboard() {
    const dataKey = '@gofinances:transactions'
    const [data, setData] = useState<DataListProps[]>([])

    async function loadTransactions() {
        const response = await AsyncStorage.getItem(dataKey)

        const transactions = response ? JSON.parse(response) : []

        const transactionsFormatted: DataListProps[] = transactions.map(
            (transaction: DataListProps) => {
                const amount = Number(transaction.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

                const formattedDate = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })
                    .format(new Date(transaction.date))

                return {
                    id: transaction.id,
                    name: transaction.name,
                    amount,
                    type: transaction.type,
                    category: transaction.category,
                    date: formattedDate,
                }
            }
        )

        setData(transactionsFormatted)


    }

    useFocusEffect(useCallback(() => {
        loadTransactions()
    }, []))

    useEffect(() => {
        loadTransactions()
        // async function removeAll() {
        //     await AsyncStorage.removeItem(dataKey)

        // }
        // removeAll()
    }, [])

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>

                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/22533625?v=4' }}
                        />

                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Roberta</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => { }}>
                        <Icon
                            name='power'
                        />
                    </LogoutButton>
                </UserWrapper>
            </Header >

            <HighlightCards>

                <HighlightCard
                    title='Entradas'
                    amount='R$ 17.400,00'
                    lastTransaction="Última entrada dia 13 de abril"
                    type='up'
                />

                <HighlightCard
                    title='Saídas'
                    amount='R$ 1.259,00'
                    lastTransaction="Última saída dia 03 de abril"
                    type='down'
                />

                <HighlightCard
                    title='Total'
                    amount='R$ 16.141,00'
                    lastTransaction="01 à 16 de abril"
                    type='total'
                />


            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <TransactionCard data={item} />
                    }

                />


            </Transactions>

        </Container >
    )
}

