import { AddressRules } from 'vtex.address-form'

import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'

import { useAccountCreateState } from './AccountCreateContext'
import AccountCreateSteps from './AccountCreatePages/AccountCreateSteps'
import IntroPage from './AccountCreatePages/IntroPage'
import PreQualifyPage from './AccountCreatePages/PreQualifyPage'
import BusinessInfoPage from './AccountCreatePages/BusinessInfoPage'
import PersonalInfoPage from './AccountCreatePages/PersonalInfoPage'
import DocumentsPage from './AccountCreatePages/DocumentsPage'
import SuccessPage from './AccountCreatePages/SuccessPage'
import AppSettings from '../graphql/AppSettings.graphql'

interface ExitProps {
  handleExit: () => void
}

interface Settings {
  storeName: string
  storePaymentName: string
}

const AccountCreatePageController: StorefrontFunctionComponent<ExitProps> = ({
  handleExit,
}) => {
  const { currentPage } = useAccountCreateState()
  const { data } = useQuery(AppSettings, { ssr: false })

  if (!data?.appSettings?.message) return null

  const settings: Settings = JSON.parse(data.appSettings.message)

  return (
    <AddressRules country="BRA" shouldUseIOFetching useGeolocation={false}>
      {currentPage === 1 && <IntroPage settings={settings} />}
      {currentPage === 2 && (
        <PreQualifyPage settings={settings} handleExit={handleExit} />
      )}
      {currentPage === 3 && (
        <Fragment>
          <AccountCreateSteps />
          <BusinessInfoPage />
        </Fragment>
      )}
      {currentPage === 4 && (
        <Fragment>
          <AccountCreateSteps />
          <PersonalInfoPage />
        </Fragment>
      )}
      {currentPage === 5 && (
        <Fragment>
          <AccountCreateSteps />
          <DocumentsPage />
        </Fragment>
      )}
      {currentPage === 6 && (
        <Fragment>
          <AccountCreateSteps />
          <SuccessPage settings={settings} handleExit={handleExit} />
        </Fragment>
      )}
    </AddressRules>
  )
}

export default AccountCreatePageController
