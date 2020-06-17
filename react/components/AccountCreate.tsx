import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import {
  AccountCreateContextProvider,
  initialAccountCreateState,
} from './AccountCreateContext'
import AccountCreatePageController from './AccountCreatePageController'
import './AccountCreatePages/styles/global.css'

interface Props {
  handleExit(): Promise<void>
  checkAccount?: boolean
}

const CSS_HANDLES = ['accountCreateContainer'] as const

const AccountCreate: StorefrontFunctionComponent<Props> = ({
  handleExit,
  checkAccount = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <AccountCreateContextProvider
      businessInformation={initialAccountCreateState.businessInformation}
      businessAddress={initialAccountCreateState.businessAddress}
      personalInformation={initialAccountCreateState.personalInformation}
      personalAddress={initialAccountCreateState.personalAddress}
      tosAcceptance={initialAccountCreateState.tosAcceptance}
      currentPage={initialAccountCreateState.currentPage}
      businessInfoValid={initialAccountCreateState.businessInfoValid}
      personalInfoValid={initialAccountCreateState.personalInfoValid}
      documentsValid={initialAccountCreateState.documentsValid}
      businessInfoComplete={initialAccountCreateState.businessInfoValid}
      personalInfoComplete={initialAccountCreateState.personalInfoValid}
      documentsComplete={initialAccountCreateState.documentsValid}
    >
      <div className={handles.accountCreateContainer}>
        <AccountCreatePageController
          handleExit={handleExit}
          checkAccount={checkAccount}
        />
      </div>
    </AccountCreateContextProvider>
  )
}

export default AccountCreate
