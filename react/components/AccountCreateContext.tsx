import React, { FunctionComponent, useContext, useReducer } from 'react'

import {
  BusinessInformation,
  PersonalInformation,
  Address,
  TOSAcceptance,
} from '../typings/flow-finance'

interface AccountCreateContextProps {
  businessInformation: BusinessInformation
  businessAddress: Address
  personalInformation: PersonalInformation
  personalAddress: Address
  tosAcceptance: TOSAcceptance
  currentPage: number
  businessInfoValid: boolean
  businessInfoComplete: boolean
  personalInfoValid: boolean
  personalInfoComplete: boolean
  documentsValid: boolean
  documentsComplete: boolean
}

type ReducerActions =
  | { type: 'SET_BUSINESS_FIELD'; args: { field: string; value: string } }
  | { type: 'SET_BUSINESS_ADDRESS'; args: { address: Address } }
  | {
      type: 'SET_PERSONAL_FIELD'
      args: { field: string; value: string | boolean }
    }
  | { type: 'SET_PERSONAL_ADDRESS'; args: { address: Address } }
  | { type: 'SET_TOS_FIELD'; args: { field: string; value: string } }
  | { type: 'SET_CURRENT_PAGE'; args: { page: number } }
  | { type: 'SET_BUSINESS_INFO_VALID'; args: { valid: boolean } }
  | { type: 'SET_PERSONAL_INFO_VALID'; args: { valid: boolean } }
  | { type: 'SET_DOCUMENTS_VALID'; args: { valid: boolean } }
  | { type: 'SET_BUSINESS_INFO_COMPLETE'; args: { complete: boolean } }
  | { type: 'SET_PERSONAL_INFO_COMPLETE'; args: { complete: boolean } }
  | { type: 'SET_DOCUMENTS_COMPLETE'; args: { complete: boolean } }

type Dispatch = (action: ReducerActions) => void

const initialAccountCreateState = {
  businessInformation: {
    businessId: '',
    name: '',
    legalName: '',
    email: '',
    phoneNumber: '',
    docType: 'CONTRATO-SOCIAL',
    physicalDocValue: '',
    physicalDocFileName: '',
  },
  businessAddress: {
    addressId: '',
    addressType: 'commercial',
    city: '',
    complement: '',
    country: 'BRA',
    geoCoordinates: [],
    receiverName: 'notApplicable',
    reference: '',
    neighborhood: '',
    number: '',
    postalCode: '',
    state: '',
    street: '',
  },
  personalInformation: {
    idNumber: '',
    maritalStatus: '',
    pep: false,
    lastName: '',
    firstName: '',
    docType: 'CNH',
    physicalDocValue: '',
    physicalDocFileName: '',
    virtualDocValue: '',
    virtualDocExp: '',
    virtualDocIssuer: '',
    email: '',
    phoneNumber: '',
    accountOpener: true,
  },
  personalAddress: {
    addressId: '',
    addressType: 'residential',
    city: '',
    complement: '',
    country: 'BRA',
    geoCoordinates: [],
    receiverName: 'notApplicable',
    reference: '',
    neighborhood: '',
    number: '',
    postalCode: '',
    state: '',
    street: '',
  },
  tosAcceptance: {
    date: '',
    ip: '',
    userAgent: '',
  },
  currentPage: 1,
  businessInfoValid: false,
  personalInfoValid: false,
  documentsValid: false,
  businessInfoComplete: false,
  personalInfoComplete: false,
  documentsComplete: false,
}

const AccountCreateStateContext = React.createContext<
  AccountCreateContextProps
>(initialAccountCreateState)
const AccountCreateDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(
  state: AccountCreateContextProps,
  action: ReducerActions
): AccountCreateContextProps {
  switch (action.type) {
    case 'SET_BUSINESS_FIELD':
      return {
        ...state,
        businessInformation: {
          ...state.businessInformation,
          [action.args.field]: action.args.value,
        },
      }
    case 'SET_BUSINESS_ADDRESS':
      return {
        ...state,
        businessAddress: action.args.address,
      }
    case 'SET_PERSONAL_FIELD':
      return {
        ...state,
        personalInformation: {
          ...state.personalInformation,
          [action.args.field]: action.args.value,
        },
      }
    case 'SET_PERSONAL_ADDRESS':
      return {
        ...state,
        personalAddress: action.args.address,
      }
    case 'SET_TOS_FIELD':
      return {
        ...state,
        tosAcceptance: {
          ...state.tosAcceptance,
          [action.args.field]: action.args.value,
        },
      }
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.args.page,
      }
    case 'SET_BUSINESS_INFO_VALID':
      return {
        ...state,
        businessInfoValid: action.args.valid,
      }
    case 'SET_PERSONAL_INFO_VALID':
      return {
        ...state,
        personalInfoValid: action.args.valid,
      }
    case 'SET_DOCUMENTS_VALID':
      return {
        ...state,
        documentsValid: action.args.valid,
      }
    case 'SET_BUSINESS_INFO_COMPLETE':
      return {
        ...state,
        businessInfoComplete: action.args.complete,
      }
    case 'SET_PERSONAL_INFO_COMPLETE':
      return {
        ...state,
        personalInfoComplete: action.args.complete,
      }
    case 'SET_DOCUMENTS_COMPLETE':
      return {
        ...state,
        documentsComplete: action.args.complete,
      }
    default:
      return state
  }
}

const AccountCreateContextProvider: FunctionComponent<AccountCreateContextProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialAccountCreateState)
  return (
    <AccountCreateStateContext.Provider value={state}>
      <AccountCreateDispatchContext.Provider value={dispatch}>
        {children}
      </AccountCreateDispatchContext.Provider>
    </AccountCreateStateContext.Provider>
  )
}

function useAccountCreateState() {
  const context = useContext(AccountCreateStateContext)
  if (context === undefined) {
    throw new Error(
      'useAccountCreateState must be used within a AccountCreateStateContextProvider'
    )
  }
  return context
}

function useAccountCreateDispatch() {
  const context = useContext(AccountCreateDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useAccountCreateDispatch must be used within a AccountCreateDispatchContextProvider'
    )
  }
  return context
}

export {
  AccountCreateContextProvider,
  initialAccountCreateState,
  useAccountCreateDispatch,
  useAccountCreateState,
}
