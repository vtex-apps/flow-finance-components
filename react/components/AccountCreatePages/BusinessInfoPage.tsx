/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  AddressContainer,
  AddressForm as AddressFields,
  inputs,
  helpers,
  PostalCodeGetter,
} from 'vtex.address-form'

import React, { useEffect, useState } from 'react'
import {
  defineMessages,
  injectIntl,
  WrappedComponentProps,
  FormattedMessage,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Input, Button, Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import { formatCNPJ, formatPhone } from './utils/formatters'

interface AddressProps {
  rules: any
}

const { StyleguideInput } = inputs
const { addValidation, isValidAddress, injectRules, validateAddress } = helpers

const CSS_HANDLES = [
  'businessInfoPageContainer',
  'businessInfoInstructions',
  'businessInfoSection',
  'businessAddressSection',
  'businessInfoPageButtonContainer',
] as const

const messages = defineMessages({
  cnpjLabel: {
    defaultMessage: 'CNPJ',
    id: 'store/flowFinance.accountCreate.cnpjLabel',
  },
  cnpjError: {
    defaultMessage: 'Please enter a valid CNPJ',
    id: 'store/flowFinance.accountCreate.cnpjError',
  },
  companyNameLabel: {
    defaultMessage: 'Company Name',
    id: 'store/flowFinance.accountCreate.companyNameLabel',
  },
  companyNameError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.companyNameError',
  },
  companyLegalNameLabel: {
    defaultMessage: 'Legal Name',
    id: 'store/flowFinance.accountCreate.companyLegalNameLabel',
  },
  companyLegalNameError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.companyLegalNameError',
  },
  companyPhoneLabel: {
    defaultMessage: 'Phone Number',
    id: 'store/flowFinance.accountCreate.companyPhoneLabel',
  },
  companyPhoneError: {
    defaultMessage: 'Please enter a valid phone number.',
    id: 'store/flowFinance.accountCreate.companyPhoneError',
  },
})

let gguid = 1

function getGGUID() {
  return (gguid++ * new Date().getTime() * -1).toString()
}

const BusinessInfoPage: StorefrontFunctionComponent<WrappedComponentProps &
  AddressProps> = ({ intl, rules }) => {
  const {
    businessInformation,
    businessAddress,
    businessInfoValid,
    currentPage,
  } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  const addressWithValidation = addValidation({
    addressQuery: null,
    ...businessAddress,
  })
  addressWithValidation.addressId.value = getGGUID()
  addressWithValidation.receiverName.value = 'notApplicable'
  addressWithValidation.receiverName.postalCodeAutoCompleted = true
  const [address, setAddress] = useState(addressWithValidation)
  const [formattedPhone, setFormattedPhone] = useState(
    formatPhone(businessInformation.phoneNumber)
  )
  const [showErrors, setShowErrors] = useState(false)
  const [showPhoneError, setShowPhoneError] = useState(false)
  const [showNameError, setShowNameError] = useState(false)
  const [showLegalNameError, setShowLegalNameError] = useState(false)

  useEffect(() => {
    if (businessInformation.phoneNumber) setShowPhoneError(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      businessInformation.phoneNumber.length >= 10 &&
      businessInformation.phoneNumber.length <= 11 &&
      businessInformation.name !== '' &&
      businessInformation.legalName !== '' &&
      isValidAddress(address, rules).valid
    ) {
      dispatch({
        type: 'SET_BUSINESS_INFO_VALID',
        args: {
          valid: true,
        },
      })
    } else if (businessInfoValid) {
      dispatch({
        type: 'SET_BUSINESS_INFO_VALID',
        args: {
          valid: false,
        },
      })
    }
  }, [businessInfoValid, businessInformation, address, rules, dispatch])

  async function handleAddressChange(newAddress: AddressFormFields) {
    const curAddress = address
    const combinedAddress = { ...curAddress, ...newAddress }
    setAddress(combinedAddress)
  }

  async function handleAddressFieldChange(newAddress: AddressFormFields) {
    const [key] = Object.keys(newAddress)
    const curAddress = address
    const validatedField = newAddress[key].value
      ? validateAddress(newAddress, rules)
      : newAddress
    const combinedAddress = { ...curAddress, ...validatedField }
    setAddress(combinedAddress)
  }

  async function handleShowErrors() {
    const validatedAddress = validateAddress(address, rules)
    setAddress(validatedAddress)
    setShowErrors(true)
  }

  async function handleContinueClick() {
    const validAddress = {
      addressId: '',
      addressType: 'commercial',
      city: address.city.value,
      complement: address.complement.value || '',
      country: 'BRA',
      geoCoordinates: [],
      receiverName: '',
      reference: '',
      neighborhood: address.neighborhood.value,
      number: address.number.value,
      postalCode: address.postalCode.value,
      state: address.state.value,
      street: address.street.value,
    }
    dispatch({
      type: 'SET_BUSINESS_ADDRESS',
      args: {
        address: validAddress,
      },
    })
    dispatch({
      type: 'SET_BUSINESS_INFO_COMPLETE',
      args: {
        complete: true,
      },
    })
    dispatch({
      type: 'SET_CURRENT_PAGE',
      args: {
        page: currentPage + 1,
      },
    })
    window.scrollTo(0, 0)
  }

  return (
    <div className={handles.businessInfoPageContainer}>
      <div className={`${handles.businessInfoInstructions} mb7`}>
        <FormattedMessage id="store/flowFinance.accountCreate.businessInfo.instructions" />
      </div>
      <section
        className={`${handles.businessInfoSection} flex flex-row flex-wrap mb7`}
      >
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.cnpjLabel)}
            value={formatCNPJ(businessInformation.businessId)}
            readOnly
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.companyPhoneLabel)}
            value={formattedPhone}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const newValue = e.currentTarget.value.replace(/[^\d]/g, '')
              setFormattedPhone(() => formatPhone(newValue))
              dispatch({
                type: 'SET_BUSINESS_FIELD',
                args: {
                  field: 'phoneNumber',
                  value: newValue,
                },
              })
            }}
            onBlur={() => setShowPhoneError(true)}
            errorMessage={
              (showErrors || showPhoneError) &&
              (businessInformation.phoneNumber.length < 10 ||
                businessInformation.phoneNumber.length > 11)
                ? intl.formatMessage(messages.companyPhoneError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.companyNameLabel)}
            value={businessInformation.name}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              dispatch({
                type: 'SET_BUSINESS_FIELD',
                args: {
                  field: 'name',
                  value: e.currentTarget.value,
                },
              })
            }}
            onBlur={() => setShowNameError(true)}
            errorMessage={
              (showErrors || showNameError) && businessInformation.name === ''
                ? intl.formatMessage(messages.companyNameError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.companyLegalNameLabel)}
            value={businessInformation.legalName}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              dispatch({
                type: 'SET_BUSINESS_FIELD',
                args: {
                  field: 'legalName',
                  value: e.currentTarget.value,
                },
              })
            }}
            onBlur={() => setShowLegalNameError(true)}
            errorMessage={
              (showErrors || showLegalNameError) &&
              businessInformation.legalName === ''
                ? intl.formatMessage(messages.companyLegalNameError)
                : ''
            }
          />
        </div>
      </section>
      <Divider orientation="horizontal" />
      <section className={`${handles.businessAddressSection} mt7 mb7`}>
        <AddressContainer
          address={address}
          Input={StyleguideInput}
          onChangeAddress={(newAddress: AddressFormFields) =>
            handleAddressChange(newAddress)
          }
          autoCompletePostalCode
        >
          <PostalCodeGetter />
          <AddressFields
            address={address}
            Input={StyleguideInput}
            omitAutoCompletedFields={false}
            omitPostalCodeFields
            onChangeAddress={(newAddress: AddressFormFields) =>
              handleAddressFieldChange(newAddress)
            }
            notApplicableLabel={intl.formatMessage({
              id: 'store/flowFinance.accountCreate.addressNotApplicable',
            })}
          />
        </AddressContainer>
      </section>
      <Divider orientation="horizontal" />
      <div
        className={`${handles.businessInfoPageButtonContainer} mt6`}
        onClick={() => handleShowErrors()}
      >
        <Button
          variation="primary"
          disabled={!businessInfoValid}
          onClick={() => handleContinueClick()}
        >
          <FormattedMessage id="store/flowFinance.accountCreate.businessInfo.submit" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(injectRules(BusinessInfoPage))
