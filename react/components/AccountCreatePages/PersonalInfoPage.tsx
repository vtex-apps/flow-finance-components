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
import { Input, Dropdown, Button, Toggle, Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import {
  formatPhone,
  formatCPF,
  // formatRG,
  // formatRGExp,
} from './utils/formatters'

interface AddressProps {
  rules: any
}

const { StyleguideInput } = inputs
const { addValidation, isValidAddress, validateAddress, injectRules } = helpers

const CSS_HANDLES = [
  'personalInfoPageContainer',
  'personalInfoInstructions',
  'personalInfoSection',
  'personalContactSection',
  'personalAddressSection',
  'personalInfoPageButtonContainer',
] as const

const messages = defineMessages({
  firstNameLabel: {
    defaultMessage: 'First Name',
    id: 'store/flowFinance.accountCreate.firstNameLabel',
  },
  firstNameError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.firstNameError',
  },
  lastNameLabel: {
    defaultMessage: 'Last Name',
    id: 'store/flowFinance.accountCreate.lastNameLabel',
  },
  lastNameError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.lastNameError',
  },
  cpfLabel: {
    defaultMessage: 'CPF',
    id: 'store/flowFinance.accountCreate.cpfLabel',
  },
  cpfError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.cpfError',
  },
  rgLabel: {
    defaultMessage: 'RG',
    id: 'store/flowFinance.accountCreate.rgLabel',
  },
  rgError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.rgError',
  },
  rgExpLabel: {
    defaultMessage: 'RG Expiration Date (DD/MM/YYYY)',
    id: 'store/flowFinance.accountCreate.rgExpLabel',
  },
  rgExpError: {
    defaultMessage: 'This field is required.',
    id: 'store/flowFinance.accountCreate.rgExpError',
  },
  phoneNumberLabel: {
    defaultMessage: 'Phone Number',
    id: 'store/flowFinance.accountCreate.personalPhoneLabel',
  },
  phoneNumberError: {
    defaultMessage: 'Please enter a valid phone number.',
    id: 'store/flowFinance.accountCreate.personalPhoneError',
  },
  pepLabel: {
    defaultMessage: 'PEP',
    id: 'store/flowFinance.accountCreate.pepLabel',
  },
  pepText: {
    defaultMessage: '',
    id: 'store/flowFinance.accountCreate.pepText',
  },
  pepLinkText: {
    defaultMessage: '',
    id: 'store/flowFinance.accountCreate.pepLinkText',
  },
  emailLabel: {
    defaultMessage: 'Email',
    id: 'store/flowFinance.accountCreate.emailLabel',
  },
  emailError: {
    defaultMessage: 'Please enter a valid email address.',
    id: 'store/flowFinance.accountCreate.emailError',
  },
  maritalStatusLabel: {
    defaultMessage: 'Marital Status',
    id: 'store/flowFinance.accountCreate.maritalStatusLabel',
  },
  maritalStatusError: {
    defaultMessage: 'Please choose a marital status.',
    id: 'store/flowFinance.accountCreate.maritalStatusError',
  },
  singleLabel: {
    defaultMessage: 'Single',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.single',
  },
  marriedLabel: {
    defaultMessage: 'Married',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.married',
  },
  separatedLabel: {
    defaultMessage: 'Legally Separated',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.separated',
  },
  divorcedLabel: {
    defaultMessage: 'Divorced',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.divorced',
  },
  widowedLabel: {
    defaultMessage: 'Widowed',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.widowed',
  },
  otherStatusLabel: {
    defaultMessage: 'Other',
    id: 'store/flowFinance.accountCreate.maritalStatusOptions.other',
  },
})

let gguid = 1

function getGGUID() {
  return (gguid++ * new Date().getTime() * -1).toString()
}

const PersonalInfoPage: StorefrontFunctionComponent<WrappedComponentProps &
  AddressProps> = ({ intl, rules }) => {
  const {
    personalInformation,
    personalAddress,
    personalInfoValid,
    currentPage,
  } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const [formattedPhone, setFormattedPhone] = useState('')
  const [formattedCPF, setFormattedCPF] = useState('')
  // const [formattedRG, setFormattedRG] = useState('')
  // const [formattedRGExp, setFormattedRGExp] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [showPhoneError, setShowPhoneError] = useState(false)
  const [showFirstNameError, setShowFirstNameError] = useState(false)
  const [showLastlNameError, setShowLastNameError] = useState(false)
  const [showEmailError, setShowEmailError] = useState(false)
  const [showCPFError, setShowCPFError] = useState(false)
  // const [showRGError, setShowRGError] = useState(false)
  // const [showRGExpError, setShowRGExpError] = useState(false)
  const [showMaritalStatusError, setShowMaritalStatusError] = useState(false)

  const addressWithValidation = addValidation({
    addressQuery: null,
    addressId: getGGUID(),
    ...personalAddress,
  })
  addressWithValidation.addressId.value = getGGUID()
  addressWithValidation.receiverName.value = 'notApplicable'
  addressWithValidation.receiverName.postalCodeAutoCompleted = true
  const [address, setAddress] = useState(addressWithValidation)

  useEffect(() => {
    if (
      personalInformation.phoneNumber.length >= 10 &&
      personalInformation.phoneNumber.length <= 11 &&
      personalInformation.email.indexOf('@') >= 0 &&
      personalInformation.email.indexOf('.') >= 0 &&
      personalInformation.firstName !== '' &&
      personalInformation.lastName !== '' &&
      personalInformation.idNumber.length === 11 &&
      personalInformation.maritalStatus !== '' &&
      isValidAddress(address, rules).valid
    ) {
      dispatch({
        type: 'SET_PERSONAL_INFO_VALID',
        args: {
          valid: true,
        },
      })
    } else if (personalInfoValid) {
      dispatch({
        type: 'SET_PERSONAL_INFO_VALID',
        args: {
          valid: false,
        },
      })
    }
  }, [personalInfoValid, personalInformation, address, rules, dispatch])

  async function handleAddressChange(newAddress: AddressFormFields) {
    const curAddress = address
    const combinedAddress = { ...curAddress, ...newAddress }
    const verifiedAddress = validateAddress(combinedAddress, rules)
    verifiedAddress.receiverName.value = 'notApplicable'
    verifiedAddress.receiverName.postalCodeAutoCompleted = true
    setAddress(verifiedAddress)
  }

  async function handleContinueClick() {
    const validAddress = {
      addressId: '',
      addressType: 'residential',
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
      type: 'SET_PERSONAL_ADDRESS',
      args: {
        address: validAddress,
      },
    })
    dispatch({
      type: 'SET_PERSONAL_INFO_COMPLETE',
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
    <div className={handles.personalInfoPageContainer}>
      <div className={`${handles.personalInfoInstructions} mb7`}>
        <FormattedMessage id="store/flowFinance.accountCreate.personalInfo.instructions" />
      </div>
      <section
        className={`${handles.personalInfoSection} flex flex-row flex-wrap mb7`}
      >
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.firstNameLabel)}
            value={personalInformation.firstName}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setShowFirstNameError(true)
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'firstName',
                  value: e.currentTarget.value,
                },
              })
            }}
            errorMessage={
              (showErrors || showFirstNameError) &&
              personalInformation.firstName === ''
                ? intl.formatMessage(messages.firstNameError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.lastNameLabel)}
            value={personalInformation.lastName}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setShowLastNameError(true)
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'lastName',
                  value: e.currentTarget.value,
                },
              })
            }}
            errorMessage={
              (showErrors || showLastlNameError) &&
              personalInformation.lastName === ''
                ? intl.formatMessage(messages.lastNameError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.cpfLabel)}
            value={formattedCPF}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setShowCPFError(true)
              const newValue = e.currentTarget.value.replace(/[^\d]/g, '')
              setFormattedCPF(formatCPF(newValue))
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'idNumber',
                  value: newValue,
                },
              })
            }}
            errorMessage={
              (showErrors || showCPFError) &&
              personalInformation.idNumber.length !== 11
                ? intl.formatMessage(messages.cpfError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Toggle
            label={intl.formatMessage(messages.pepLabel)}
            checked={personalInformation.pep}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'pep',
                  value: e.currentTarget.checked,
                },
              })
            }
            helpText={
              <span>
                {intl.formatMessage(messages.pepText)}{' '}
                <a
                  href="http://www.cvm.gov.br/legislacao/instrucoes/inst301.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage(messages.pepLinkText)}
                </a>
              </span>
            }
          />
        </div>
      </section>
      <Divider orientation="horizontal" />
      <section
        className={`${handles.personalContactSection} flex flex-row flex-wrap mb7`}
      >
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.phoneNumberLabel)}
            value={formattedPhone}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setShowPhoneError(true)
              const newValue = e.currentTarget.value.replace(/[^\d]/g, '')
              setFormattedPhone(() => formatPhone(newValue))
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'phoneNumber',
                  value: newValue,
                },
              })
            }}
            errorMessage={
              (showErrors || showPhoneError) &&
              personalInformation.phoneNumber.length < 10
                ? intl.formatMessage(messages.phoneNumberError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Input
            label={intl.formatMessage(messages.emailLabel)}
            value={personalInformation.email}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setShowEmailError(true)
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'email',
                  value: e.currentTarget.value,
                },
              })
            }}
            errorMessage={
              (showErrors || showEmailError) &&
              (personalInformation.email === '' ||
                personalInformation.email.indexOf('@') < 0 ||
                personalInformation.email.indexOf('.') < 0)
                ? intl.formatMessage(messages.emailError)
                : ''
            }
          />
        </div>
        <div className="w-50-ns w-100-s pa2 pb4">
          <Dropdown
            label={intl.formatMessage(messages.maritalStatusLabel)}
            value={personalInformation.maritalStatus}
            options={[
              {
                value: 'single',
                label: intl.formatMessage(messages.singleLabel),
              },
              {
                value: 'married',
                label: intl.formatMessage(messages.marriedLabel),
              },
              {
                value: 'legally-separated',
                label: intl.formatMessage(messages.separatedLabel),
              },
              {
                value: 'divorced',
                label: intl.formatMessage(messages.divorcedLabel),
              },
              {
                value: 'widowed',
                label: intl.formatMessage(messages.widowedLabel),
              },
              {
                value: 'other',
                label: intl.formatMessage(messages.otherStatusLabel),
              },
            ]}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => {
              setShowMaritalStatusError(true)
              dispatch({
                type: 'SET_PERSONAL_FIELD',
                args: {
                  field: 'maritalStatus',
                  value: e.currentTarget.value,
                },
              })
            }}
            errorMessage={
              (showErrors || showMaritalStatusError) &&
              personalInformation.maritalStatus === ''
                ? intl.formatMessage(messages.maritalStatusError)
                : ''
            }
          />
        </div>
      </section>
      <Divider orientation="horizontal" />
      <section className={`${handles.personalAddressSection} mb7`}>
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
            omitAutoCompletedFields
            omitPostalCodeFields
            onChangeAddress={(newAddress: AddressFormFields) =>
              handleAddressChange(newAddress)
            }
            notApplicableLabel={intl.formatMessage({
              id: 'store/flowFinance.accountCreate.addressNotApplicable',
            })}
          />
        </AddressContainer>
      </section>
      <Divider orientation="horizontal" />
      <div className={`${handles.personalInfoPageButtonContainer} mt6`}>
        <Button
          variation="primary"
          disabled={!personalInfoValid}
          onClick={() => handleContinueClick()}
          onMouseEnter={() => setShowErrors(true)}
          onFocus={() => setShowErrors(true)}
        >
          <FormattedMessage id="store/flowFinance.accountCreate.personalInfo.submit" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(injectRules(PersonalInfoPage))
