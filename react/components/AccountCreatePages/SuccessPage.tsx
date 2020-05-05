import React from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Button, Divider } from 'vtex.styleguide'

interface SuccessProps {
  handleExit: () => void
  settings: Settings
}

interface Settings {
  storeName: string
  storePaymentName: string
}

const CSS_HANDLES = [
  'successPageContainer',
  'successPageTitle',
  'successPageMessage',
  'successPageButtonContainer',
] as const

const SuccessPage: StorefrontFunctionComponent<SuccessProps &
  WrappedComponentProps> = ({ handleExit, settings }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.successPageContainer}>
      <h1 className={handles.successPageTitle}>
        <FormattedMessage id="store/flowFinance.accountCreate.successPage.title" />
      </h1>
      <div className={`${handles.successPageMessage} mb6`}>
        <FormattedMessage
          id="store/flowFinance.accountCreate.successPage.message"
          values={{
            lineBreak: <br />,
            storePaymentName: settings.storePaymentName,
          }}
        />
      </div>
      <Divider orientation="horizontal" />
      <div className={`${handles.successPageButtonContainer} mt6`}>
        <Button variation="primary" onClick={() => handleExit()}>
          <FormattedMessage id="store/flowFinance.accountCreate.continueShopping" />
        </Button>
      </div>
    </div>
  )
}

export default injectIntl(SuccessPage)
