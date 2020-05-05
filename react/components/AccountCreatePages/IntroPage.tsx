import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Button, Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import IconMouse from '../../images/mouse.svg'
import IconCart from '../../images/cart.svg'
import FlowFinanceLogo from '../../images/flow-finance-logo.png'

interface SettingsProps {
  settings: Settings
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
  `poweredByContainer`,
] as const

const IntroPage: StorefrontFunctionComponent<SettingsProps> = ({
  settings,
}) => {
  const { currentPage } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()
  const handles = useCssHandles(CSS_HANDLES)

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
        >
          <FormattedMessage id="store/flowFinance.accountCreate.introPage.continue" />
        </Button>
        <div className={`${handles.poweredByContainer} flex flex-row`}>
          <div className="flex flex-column justify-center">
            <FormattedMessage id="store/flowFinance.accountCreate.introPage.poweredBy" />
          </div>
          <img src={FlowFinanceLogo} alt="Flow Finance" />
        </div>
      </div>
    </div>
  )
}

export default IntroPage
