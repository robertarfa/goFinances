import React, { useState } from 'react'
import {
    Alert, Keyboard,
    Modal,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import { SuccessModal } from '../../components/SuccessModal/SuccessModal'
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
import { ErrorModal } from '../../components/ErrorModal/ErrorModal'

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
        reset,
        formState: { errors }
    } = useForm()

    const navigation = useNavigation()


    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)

    const [objError, setObjError] = useState<errorData>({
        name: null,
        amount: null,
    })

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
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
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = '@gofinances:transactions'
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria'
            })

            setSuccessModalOpen(true)
            // console.log(dataFormatted)

            setTimeout(() => {
                navigation.navigate('Listagem')
                setSuccessModalOpen(false)

            }, 3000);

        } catch (error) {
            // console.log(error)
            setErrorModalOpen(true)

            setTimeout(() => {
                setErrorModalOpen(false)

            }, 3000);
            // Alert.alert("Não foi possível salvar!")
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
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
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

                {successModalOpen && <SuccessModal text='Transação cadastrada com sucesso!' />}
                {errorModalOpen && <ErrorModal text='Ocorreu um erro inesperado! Tente novamente!' />}
            </Container>
        </TouchableWithoutFeedback>
    )
}
