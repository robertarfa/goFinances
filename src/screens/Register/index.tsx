import React, { useEffect, useState } from 'react'
import {
    Alert, Keyboard,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useForm } from 'react-hook-form'

import { Button } from '../../components/Forms/Button'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { InputForm } from '../../components/Forms/InputForm'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelect } from '../CategorySelect'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles'

interface formData {
    name: string;
    amount: number;
}

interface errorData {
    name: any;
    amount: any;
}

export function Register() {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const dataKey = '@gofinances:transactions'

    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)

    const [objError, setObjError] = useState<errorData>({
        name: null,
        amount: null,
    })

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })

    useEffect(() => {
        async function loadData() {
            const data = await AsyncStorage.getItem(dataKey)
            console.log('dataKey', JSON.parse(data!))
        }

        loadData()
        // async function removeAll() {
        //     await AsyncStorage.removeItem(dataKey)

        // }
        // removeAll()
    }, [])

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionType(type)
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false)
    }

    function fntCleanErrorMsg() {
        setObjError({
            name: null,
            amount: null,
        })
    }

    async function handleRegister(form: formData) {

        setTimeout(() => {
            fntCleanErrorMsg()
        }, 2000);

        if (!form.name)
            return setObjError((prev) => ({ ...prev, name: 'Nome é obrigatório' }))

        if (!form.amount)
            return setObjError((prev) => ({ ...prev, amount: 'Valor é obrigatório' }))

        if (form.amount < 0)
            return Alert.alert('O valor não pode ser negativo')

        if (!transactionType)
            return Alert.alert('Selecione o tipo da transação')

        if (category.key === 'category')
            return Alert.alert('Selecione a categoria')

        const newTransaction = {
            nome: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        try {

            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível salvar!")
        }
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>

                    <Title>
                        Cadastro
                    </Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            error={objError.name}
                        />
                        <InputForm
                            name='amount'
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={objError.amount}
                        />

                        <TransactionTypes>
                            <TransactionTypeButton
                                type='up'
                                title='Income'
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive={transactionType === 'up'}
                            />

                            <TransactionTypeButton
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive={transactionType === 'down'}
                            />
                        </TransactionTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}
