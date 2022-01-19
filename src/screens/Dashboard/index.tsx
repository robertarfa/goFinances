import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components/native';

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
    LogoutButton,
    LoadContainer
} from './styles'

export interface DataListProps extends TransactionCardProps {
    id: string,
}

interface HighlightProps {
    amount: string,
    lastTransaction: string,
}

interface HighlightData {
    entries: HighlightProps,
    expensives: HighlightProps,
    total: HighlightProps,
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([])
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme()

    const dataKey = '@gofinances:transactions'

    function getLastTransactionDate(
        collection: DataListProps[], type: 'positive' | 'negative'
    ) {

        const lastTransaction =
            new Date(
                Math.max.apply(Math, collection
                    .filter(transaction => transaction.type === type)
                    .map((transaction) => new Date(transaction.date).getTime())
                ))

        return `${lastTransaction.getDate()} de ${lastTransaction
            .toLocaleString("pt-BR", {
                month: 'long'
            })}`
    }

    async function loadTransactions() {
        const response = await AsyncStorage.getItem(dataKey)

        const transactions = response ? JSON.parse(response) : []

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map(
                (transaction: DataListProps) => {

                    if (transaction.type === 'positive') {
                        entriesTotal += Number(transaction.amount)
                    } else {
                        expensiveTotal += Number(transaction.amount)
                    }


                    const amount = Number(transaction.amount)
                        .toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })

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

        setTransactions(transactionsFormatted)

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative')
        const totalInterval = `01 à ${lastTransactionExpensive}`

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionEntries}`

            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionExpensive}`

            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }

        })
        setIsLoading(false)

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
            {isLoading ?
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer>
                :
                <>
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
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                            type='up'
                        />

                        <HighlightCard
                            title='Saídas'
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                            type='down'
                        />

                        <HighlightCard
                            title='Total'
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                            type='total'
                        />


                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <TransactionCard data={item} />
                            }

                        />


                    </Transactions>
                </>}
        </Container >
    )
}

