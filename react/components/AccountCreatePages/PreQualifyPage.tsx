import React, { useEffect, useState } from 'react'
import {
  defineMessages,
  injectIntl,
  WrappedComponentProps,
  FormattedMessage,
} from 'react-intl'
import { useQuery, useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { Input, Spinner, Button, Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import { formatCNPJ } from './utils/formatters'
import Profile from '../../graphql/Profile.graphql'
import PreQualify from '../../graphql/PreQualify.graphql'

interface PreQualifyProps {
  handleExit: () => void
  settings: Settings
}

interface Settings {
  storeName: string
  storePaymentName: string
}

const CSS_HANDLES = [
  'preQualifyPageContainer',
  'preQualifyInstructions',
  'preQualifySection',
  'preQualifyPageButtonContainer',
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
})

const PreQualifyPage: StorefrontFunctionComponent<PreQualifyProps &
  WrappedComponentProps> = ({ intl, handleExit, settings }) => {
  const { data, loading } = useQuery(Profile)
  const [preQualified, setPreQualified] = useState(true)
  const { businessInformation, currentPage } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()
  const handles = useCssHandles(CSS_HANDLES)

  const [formattedCNPJ, setFormattedCNPJ] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  const [checkPreQualify] = useMutation(PreQualify)

  useEffect(() => {
    if (data?.profile) {
      if (data.profile.corporateDocument) {
        dispatch({
          type: 'SET_BUSINESS_FIELD',
          args: {
            field: 'businessId',
            value: data.profile.corporateDocument,
          },
        })
        setFormattedCNPJ(formatCNPJ(data.profile.corporateDocument))
        setShowError(true)
      }
      dispatch({
        type: 'SET_BUSINESS_FIELD',
        args: {
          field: 'email',
          value: data.profile.email,
        },
      })
      if (data.profile.corporateName) {
        dispatch({
          type: 'SET_BUSINESS_FIELD',
          args: {
            field: 'name',
            value: data.profile.corporateName,
          },
        })
      }
      if (data.profile.businessPhone) {
        dispatch({
          type: 'SET_BUSINESS_FIELD',
          args: {
            field: 'phoneNumber',
            value: data.profile.businessPhone,
          },
        })
      }
      if (data.profile.firstName) {
        dispatch({
          type: 'SET_PERSONAL_FIELD',
          args: {
            field: 'firstName',
            value: data.profile.firstName,
          },
        })
      }
      if (data.profile.lastName) {
        dispatch({
          type: 'SET_PERSONAL_FIELD',
          args: {
            field: 'lastName',
            value: data.profile.lastName,
          },
        })
      }
      if (data.profile.homePhone) {
        dispatch({
          type: 'SET_PERSONAL_FIELD',
          args: {
            field: 'phoneNumber',
            value: data.profile.homePhone,
          },
        })
      }
    }
  }, [data, dispatch])

  async function submitPreQualify() {
    setIsLoading(true)
    checkPreQualify({
      variables: { cnpj: businessInformation.businessId },
    }).then(response => {
      setIsLoading(false)
      if (!response.data || !response.data.checkPreQualify) {
        setPreQualified(false)
        return
      }
      dispatch({
        type: 'SET_CURRENT_PAGE',
        args: {
          page: currentPage + 1,
        },
      })
      window.scrollTo(0, 0)
    })
  }

  if (loading) return <Spinner />

  if (!preQualified)
    return (
      <div className={handles.preQualifyPageContainer}>
        <div className={`${handles.preQualifyInstructions} mb6`}>
          <FormattedMessage
            id="store/flowFinance.accountCreate.preQualify.notQualifiedMessage"
            values={{
              storePaymentName: settings.storePaymentName,
            }}
          />
        </div>
        <Divider orientation="horizontal" />
        <div className={`${handles.preQualifyPageButtonContainer} mt6`}>
          <Button variation="primary" onClick={() => handleExit()}>
            <FormattedMessage id="store/flowFinance.accountCreate.continueShopping" />
          </Button>
        </div>
      </div>
    )

  return (
    <div className={handles.preQualifyPageContainer}>
      <div className={`${handles.preQualifyInstructions} mb6`}>
        <FormattedMessage
          id="store/flowFinance.accountCreate.preQualify.instructions"
          values={{
            storeName: settings.storeName,
          }}
        />
      </div>
      <section className={`${handles.preQualifySection} mb6`}>
        <Input
          label={intl.formatMessage(messages.cnpjLabel)}
          value={formattedCNPJ}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const newValue = e.currentTarget.value
              .replace(/[^\d]/g, '')
              .slice(0, 14)
            setFormattedCNPJ(() => formatCNPJ(newValue))
            dispatch({
              type: 'SET_BUSINESS_FIELD',
              args: {
                field: 'businessId',
                value: newValue,
              },
            })
            setShowError(true)
          }}
          errorMessage={
            showError && businessInformation.businessId.length !== 14
              ? intl.formatMessage(messages.cnpjError)
              : ''
          }
        />
      </section>
      <Divider orientation="horizontal" />
      <div className={`${handles.preQualifyPageButtonContainer} mt6`}>
        <Button
          variation="primary"
          disabled={businessInformation.businessId.length !== 14}
          isLoading={isLoading}
          onClick={() => submitPreQualify()}
        >
          <FormattedMessage id="store/flowFinance.accountCreate.preQualify.submit" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(PreQualifyPage)
