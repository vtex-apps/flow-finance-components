import React from 'react'
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Divider } from 'vtex.styleguide'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import IconCheck from '../../images/check.svg'

const CSS_HANDLES = [
  'accountCreateStepsContainer',
  'accountCreateStep',
  'accountCreateStepNumberContainer',
  'accountCreateStepNumber',
  'accountCreateStepLabel',
] as const

const AccountCreateSteps: StorefrontFunctionComponent<WrappedComponentProps> = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    currentPage,
    businessInfoComplete,
    personalInfoComplete,
    documentsComplete,
  } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()

  if (currentPage < 3) return null

  async function handlePageChange(page: number) {
    if (currentPage === page) return
    dispatch({
      type: 'SET_CURRENT_PAGE',
      args: {
        page,
      },
    })
    window.scrollTo(0, 0)
  }

  return (
    <div
      className={`${handles.accountCreateStepsContainer} flex flex-row justify-between pb6 mb6`}
      style={{ borderBottom: '2px solid black' }}
    >
      <div className={`${handles.accountCreateStep} tc ph3`}>
        <div className={handles.accountCreateStepNumberContainer}>
          <button
            className={`input-reset button-reset br-100 mb2 b--none bg-base--inverted ${
              currentPage !== 6 ? 'pointer' : ''
            }`}
            style={{ width: 32, height: 32 }}
            onClick={() => handlePageChange(3)}
            disabled={currentPage === 6}
          >
            <span className={`${handles.accountCreateStepNumber} white`}>
              {!businessInfoComplete ? (
                '1'
              ) : (
                <img src={IconCheck} alt="Complete" />
              )}
            </span>
          </button>
        </div>
        <div className={handles.accountCreateStepLabel}>
          <FormattedMessage id="store/flowFinance.accountCreate.steps.businessInfo" />
        </div>
      </div>
      <div className="flex-grow-1 flex flex-column justify-center">
        <Divider orientation="horizontal" />
      </div>
      <div className={`${handles.accountCreateStep} tc ph3`}>
        <div className={handles.accountCreateStepNumberContainer}>
          <button
            className={`input-reset button-reset br-100 mb2 b--none ${
              currentPage > 3 ? 'bg-base--inverted' : 'bg-muted-3'
            } ${currentPage !== 6 && businessInfoComplete ? 'pointer' : ''}`}
            style={{ width: 32, height: 32 }}
            onClick={() => handlePageChange(4)}
            disabled={!businessInfoComplete || currentPage === 6}
          >
            <span className={`${handles.accountCreateStepNumber} white`}>
              {!personalInfoComplete ? (
                '2'
              ) : (
                <img src={IconCheck} alt="Complete" />
              )}
            </span>
          </button>
        </div>
        <div
          className={`${handles.accountCreateStepLabel}  ${
            currentPage > 3 ? '' : 'c-muted-4'
          }`}
        >
          <FormattedMessage id="store/flowFinance.accountCreate.steps.personalInfo" />
        </div>
      </div>
      <div className="flex-grow-1 flex flex-column justify-center">
        <Divider orientation="horizontal" />
      </div>
      <div className={`${handles.accountCreateStep} tc ph3`}>
        <div className={handles.accountCreateStepNumberContainer}>
          <button
            className={`input-reset button-reset br-100 mb2 b--none ${
              currentPage > 4 ? 'bg-base--inverted' : 'bg-muted-3'
            } ${currentPage !== 6 && personalInfoComplete ? 'pointer' : ''}`}
            style={{ width: 32, height: 32 }}
            onClick={() => handlePageChange(5)}
            disabled={!personalInfoComplete || currentPage === 6}
          >
            <span className={`${handles.accountCreateStepNumber} white`}>
              {!documentsComplete ? (
                '3'
              ) : (
                <img src={IconCheck} alt="Complete" />
              )}
            </span>
          </button>
        </div>
        <div
          className={`${handles.accountCreateStepLabel}  ${
            currentPage > 4 ? '' : 'c-muted-4'
          }`}
        >
          <FormattedMessage id="store/flowFinance.accountCreate.steps.documents" />
        </div>
      </div>
    </div>
  )
}

export default injectIntl(AccountCreateSteps)
