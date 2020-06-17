import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { Button, Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import IconMouse from '../../images/mouse.svg'
import IconCart from '../../images/cart.svg'
import FlowFinanceLogo from '../../images/flow-finance-logo.png'
import Profile from '../../graphql/Profile.graphql'

interface Props {
  settings: Settings
  checkAccount: boolean
}

interface Settings {
  storeName: string
  storePaymentName: string
}

const CSS_HANDLES = [
  'introPageContainer',
  'introPageInstructions',
  'introPageTitle',
  'introPageIconsContainer',
  'introPageLeftIconContainer',
  'introPageLeftIcon',
  'introPageLeftIconTitle',
  'introPageLeftIconText',
  'introPageRightIconContainer',
  'introPageRightIcon',
  'introPageRightIconTitle',
  'introPageRightIconText',
  `introPageButtonContainer`,
  'introPageAccountErrorContainer',
  `poweredByContainer`,
] as const

const IntroPage: StorefrontFunctionComponent<Props> = ({
  settings,
  checkAccount,
}) => {
  const { currentPage } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()
  const [accountStatus, setAccountStatus] = useState('none')
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useQuery(Profile, { skip: !checkAccount })

  async function postData(url = '', dataToPost = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(dataToPost),
    })
    if (!response.ok) {
      console.error(response)
      return response
    }
    return response.json()
  }

  useEffect(() => {
    if (data?.profile) {
      postData(`/_v/api/connectors/flow-finance/get-loan-options`, {
        email: data.profile.email,
        total: 1000,
      }).then(response => {
        setAccountStatus('approved' || response.accountStatus)
      })
    }
  }, [data])

  return (
    <div className={handles.introPageContainer}>
      <h1 className={`${handles.introPageTitle} tc mb6`}>
        <FormattedMessage id="store/flowFinance.accountCreate.introPage.title" />
      </h1>
      <div className={`${handles.introPageInstructions} tc mb6`}>
        <FormattedMessage
          id="store/flowFinance.accountCreate.introPage.instructions"
          values={{
            storePaymentName: settings.storePaymentName,
          }}
        />
      </div>
      <div
        className={`${handles.introPageIconsContainer} flex flex-row justify-around mb6`}
      >
        <div className={`${handles.introPageLeftIconContainer} w-50 pa3 tc`}>
          <img
            src={IconMouse}
            alt="Mouse icon"
            className={handles.introPageLeftIcon}
          />
          <div className={`${handles.introPageLeftIconTitle} b mt2`}>
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.leftIconTitle" />
          </div>
          <div className={handles.introPageLeftIconText}>
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.leftIconText" />
          </div>
        </div>
        <div className={`${handles.introPageRightIconContainer} w-50 pa3 tc`}>
          <img
            src={IconCart}
            alt="Cart icon"
            className={handles.introPageRightIcon}
          />
          <div className={`${handles.introPageRightIconTitle} b mt2`}>
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.rightIconTitle" />
          </div>
          <div className={handles.introPageRightIconText}>
            <FormattedMessage
              id="store/flowFinance.accountCreate.introPage.rightIconText"
              values={{
                storePaymentName: settings.storePaymentName,
              }}
            />
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" />
      <div
        className={`${handles.introPageButtonContainer} mt6 flex flex-row justify-between`}
      >
        <div>
          <Button
            variation="primary"
            onClick={() => {
              dispatch({
                type: 'SET_CURRENT_PAGE',
                args: {
                  page: currentPage + 1,
                },
              })
              window.scrollTo(0, 0)
            }}
            disabled={accountStatus !== 'none' && accountStatus !== 'pending'}
          >
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.continue" />
          </Button>
          <div
            className={`${handles.introPageAccountErrorContainer} mt2 red mw6`}
          >
            {accountStatus === 'under-review' && (
              <FormattedMessage id="store/flowFinance.accountCreate.introPage.accountErrors.underReview" />
            )}
            {accountStatus === 'approved' && (
              <FormattedMessage id="store/flowFinance.accountCreate.introPage.accountErrors.approved" />
            )}
            {accountStatus === 'rejected' && (
              <FormattedMessage id="store/flowFinance.accountCreate.introPage.accountErrors.rejected" />
            )}
          </div>
        </div>
        <div className={`${handles.poweredByContainer} flex flex-row`}>
          <div className="flex flex-column justify-center">
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.poweredBy" />
          </div>
          <img
            src={FlowFinanceLogo}
            alt="Flow Finance"
            className="self-center"
          />
        </div>
      </div>
    </div>
  )
}

export default IntroPage
