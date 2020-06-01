import React, { useState, useEffect } from 'react'
import {
  injectIntl,
  defineMessages,
  WrappedComponentProps,
  FormattedMessage,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import {
  Button,
  Divider,
  Checkbox,
  ButtonWithIcon,
  IconDelete,
} from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import {
  useAccountCreateState,
  useAccountCreateDispatch,
} from '../AccountCreateContext'
import { formatPhone } from './utils/formatters'
import DocumentDropzone from './DocumentDropzone'
import IconId from '../../images/id.svg'
import IconIdGray from '../../images/id-gray.svg'
import IconContrato from '../../images/contrato.svg'
import IconContratoGray from '../../images/contrato-gray.svg'
import ProcessApplication from '../../graphql/ProcessApplication.graphql'

interface DocumentsPageProps {
  settings: Settings
}

interface Settings {
  tosPdfPath: string
}

const CSS_HANDLES = [
  'documentsPageContainer',
  'documentsPageInstructions',
  'documentTypesContainer',
  'documentTypeContainer',
  'documentTypeIcon',
  'documentTypeLabel',
  'documentFilenameContainer',
  'documentFilenameText',
  'documentRemoveButton',
  'documentUploadButton',
  'documentUploadButtonText',
  'tosAcceptanceContainer',
  'tosIframeContainer',
  'tosAcceptanceCheckbox',
  'tosAcceptanceCheckboxLabel',
  'documentsPageButtonContainer',
  'documentsPageErrorContainer',
] as const

const messages = defineMessages({
  submitError: {
    defaultMessage:
      'There was an error submitting your application. Please try again.',
    id: 'store/flowFinance.accountCreate.submitApplication.error',
  },
})

const DocumentsPage: StorefrontFunctionComponent<DocumentsPageProps &
  WrappedComponentProps> = ({ settings: { tosPdfPath }, intl }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [pageMode, setPageMode] = useState('select')
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    businessInformation,
    businessAddress,
    personalInformation,
    personalAddress,
    documentsValid,
    currentPage,
  } = useAccountCreateState()
  const dispatch = useAccountCreateDispatch()

  const [submitApplication] = useMutation(ProcessApplication)

  useEffect(() => {
    if (
      businessInformation.physicalDocValue !== '' &&
      personalInformation.physicalDocValue !== ''
    ) {
      dispatch({
        type: 'SET_DOCUMENTS_VALID',
        args: {
          valid: true,
        },
      })
    } else if (documentsValid) {
      dispatch({
        type: 'SET_DOCUMENTS_VALID',
        args: {
          valid: false,
        },
      })
    }
  }, [
    businessInformation.physicalDocValue,
    dispatch,
    documentsValid,
    personalInformation.physicalDocValue,
  ])

  async function handlePageModeChange(newPageMode: string) {
    setPageMode(newPageMode)
    window.scrollTo(0, 0)
  }

  async function handleRemoveFile(documentType: string) {
    dispatch({
      type:
        documentType === 'business'
          ? 'SET_BUSINESS_FIELD'
          : 'SET_PERSONAL_FIELD',
      args: {
        field: 'physicalDocValue',
        value: '',
      },
    })
    dispatch({
      type:
        documentType === 'business'
          ? 'SET_BUSINESS_FIELD'
          : 'SET_PERSONAL_FIELD',
      args: {
        field: 'physicalDocFileName',
        value: '',
      },
    })
  }

  async function handleContinueClick() {
    setIsLoading(true)
    submitApplication({
      variables: {
        application: {
          businessInfo: {
            businessId: businessInformation.businessId,
            name: businessInformation.name,
            legalName: businessInformation.legalName,
            address: {
              streetName: businessAddress.street,
              streetNumber: businessAddress.number,
              postalCode: businessAddress.postalCode,
              district: businessAddress.neighborhood,
              city: businessAddress.city,
              stateCode: businessAddress.state,
              country: businessAddress.country,
              extraAddressInfo: businessAddress.complement,
            },
            contactInfo: {
              email: businessInformation.email,
              phoneNumber: formatPhone(businessInformation.phoneNumber),
            },
            documents: {
              physicalDocument: [
                {
                  type: businessInformation.docType,
                  value: businessInformation.physicalDocValue,
                },
              ],
            },
          },
          personalInfo: {
            idNumber: personalInformation.idNumber,
            maritalStatus: personalInformation.maritalStatus,
            pep: personalInformation.pep,
            lastName: personalInformation.lastName,
            firstName: personalInformation.firstName,
            address: {
              streetName: personalAddress.street,
              streetNumber: personalAddress.number,
              postalCode: personalAddress.postalCode,
              district: personalAddress.neighborhood,
              city: personalAddress.city,
              stateCode: personalAddress.state,
              country: personalAddress.country,
              extraAddressInfo: personalAddress.complement,
            },
            documents: {
              physicalDocument: [
                {
                  type: personalInformation.docType,
                  value: personalInformation.physicalDocValue,
                },
              ],
            },
            contactInfo: {
              email: personalInformation.email,
              phoneNumber: formatPhone(personalInformation.phoneNumber),
            },
            accountOpener: personalInformation.accountOpener,
          },
          tosAcceptance: {
            userAgent: navigator.userAgent,
          },
        },
      },
    }).then(
      response => {
        if (
          !response.data ||
          !response.data.processApplication ||
          (!response.data.processApplication.success &&
            !response.data.processApplication.error)
        ) {
          setSubmitError(intl.formatMessage(messages.submitError))
          setIsLoading(false)
          return
        }
        if (
          !response.data.processApplication.success &&
          response.data.processApplication.error
        ) {
          setSubmitError(intl.formatMessage(messages.submitError))
          console.error(response.data.processApplication.error)
          setIsLoading(false)
          return
        }
        setSubmitError('')
        dispatch({
          type: 'SET_DOCUMENTS_COMPLETE',
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
      },
      () => {
        setSubmitError(intl.formatMessage(messages.submitError))
        setIsLoading(false)
      }
    )
  }

  switch (pageMode) {
    case 'personal': {
      return (
        <div className={handles.documentsPageContainer}>
          <DocumentDropzone documentType="personal" maxSize={3 * 1024 * 1024} />
          <Divider orientation="horizontal" />
          <div className="mt6">
            <Button
              variation="primary"
              onClick={() => handlePageModeChange('select')}
              disabled={personalInformation.physicalDocValue === ''}
            >
              <FormattedMessage id="store/flowFinance.accountCreate.documents.continueLabel" />
            </Button>
          </div>
        </div>
      )
    }
    case 'business': {
      return (
        <div className={handles.documentsPageContainer}>
          <DocumentDropzone
            documentType="business"
            maxSize={10 * 1024 * 1024}
          />
          <Divider orientation="horizontal" />
          <div className="mt6">
            <Button
              variation="primary"
              onClick={() => handlePageModeChange('select')}
              disabled={businessInformation.physicalDocValue === ''}
            >
              <FormattedMessage id="store/flowFinance.accountCreate.documents.continueLabel" />
            </Button>
          </div>
        </div>
      )
    }
    default: {
      return (
        <div className={handles.documentsPageContainer}>
          <div className={`${handles.documentsPageInstructions} mb7`}>
            <FormattedMessage id="store/flowFinance.accountCreate.documents.instructions" />
          </div>
          <div
            className={`${handles.documentTypesContainer} flex flex-row justify-between mb7`}
          >
            <div className={`${handles.documentTypeContainer} w-50 pa2 tc`}>
              <img
                src={
                  personalInformation.physicalDocValue === ''
                    ? IconIdGray
                    : IconId
                }
                alt="ID Icon"
                className={`${handles.documentTypeIcon}`}
              />
              <div
                className={`${handles.documentTypeLabel} ma3 ${
                  personalInformation.physicalDocValue === '' ? 'c-muted-4' : ''
                }`}
              >
                <FormattedMessage id="store/flowFinance.accountCreate.documents.personalIdLabel" />
              </div>
              {personalInformation.physicalDocFileName !== '' ? (
                <div
                  className={`${handles.documentFilenameContainer} ma3 flex flex-row justify-center items-center`}
                >
                  <span className={`${handles.documentFilenameText}`}>
                    {personalInformation.physicalDocFileName}
                  </span>
                  <ButtonWithIcon
                    onClick={() => handleRemoveFile('personal')}
                    variation="tertiary"
                    icon={<IconDelete />}
                    className={`${handles.documentRemoveButton}`}
                  />
                </div>
              ) : (
                <button
                  onClick={() => handlePageModeChange('personal')}
                  className={`${handles.documentUploadButton} vtex-button bw1 ba fw5 v-mid relative pa0 lh-solid br2 min-h-regular t-action bg-action-secondary b--action-secondary c-on-action-secondary hover-bg-action-secondary hover-b--action-secondary hover-c-on-action-secondary pointer`}
                  type="button"
                >
                  <div
                    className={`${handles.documentUploadButtonText} vtex-button__label flex items-center justify-center h-100 ph6`}
                    style={{ paddingTop: '0.25em', paddingBottom: '0.32em' }}
                  >
                    <FormattedMessage id="store/flowFinance.accountCreate.documents.uploadLabel" />
                  </div>
                </button>
              )}
            </div>
            <div className={`${handles.documentTypeContainer} w-50 pa2 tc`}>
              <img
                src={
                  businessInformation.physicalDocValue === ''
                    ? IconContratoGray
                    : IconContrato
                }
                alt="ID Icon"
                className={`${handles.documentTypeIcon}`}
              />
              <div
                className={`${handles.documentTypeLabel} ma3 ${
                  businessInformation.physicalDocValue === '' ? 'c-muted-4' : ''
                }`}
              >
                <FormattedMessage id="store/flowFinance.accountCreate.documents.businessIdLabel" />
              </div>
              {businessInformation.physicalDocFileName !== '' ? (
                <div
                  className={`${handles.documentFilenameContainer} ma3 flex flex-row justify-center items-center`}
                >
                  <span className={`${handles.documentFilenameText}`}>
                    {businessInformation.physicalDocFileName}
                  </span>
                  <ButtonWithIcon
                    onClick={() => handleRemoveFile('business')}
                    variation="tertiary"
                    icon={<IconDelete />}
                    className={`${handles.documentRemoveButton}`}
                  />
                </div>
              ) : (
                <Button
                  variation="secondary"
                  onClick={() => handlePageModeChange('business')}
                  className={`${handles.documentUploadButton}`}
                >
                  <span className={`${handles.documentUploadButtonText}`}>
                    <FormattedMessage id="store/flowFinance.accountCreate.documents.uploadLabel" />
                  </span>
                </Button>
              )}
            </div>
          </div>
          <Divider orientation="horizontal" />
          {documentsValid && (
            <div className={`${handles.tosAcceptanceContainer} mt7 mb7`}>
              <h2>
                <FormattedMessage id="store/flowFinance.accountCreate.tosTitle" />
              </h2>
              <div className={`${handles.tosIframeContainer} mb7`}>
                <iframe
                  title="Flow Finance Loan Agreement"
                  width="95%"
                  height={400}
                  src={tosPdfPath}
                  data-testid="embedded-pdf"
                  className="db center"
                  frameBorder="0"
                  onLoad={() => setPdfLoaded(true)}
                />
              </div>
              <Checkbox
                label={
                  <span className={`${handles.tosAcceptanceCheckboxLabel}`}>
                    <FormattedMessage id="store/flowFinance.accountCreate.tosCheckboxLabel" />
                  </span>
                }
                className={`${handles.tosAcceptanceCheckbox} mt4`}
                checked={tosAccepted}
                id="tos-accept"
                name="tos-accept"
                value="tos-accept"
                onChange={() => setTosAccepted(!tosAccepted)}
              />
            </div>
          )}
          <div className={`${handles.documentsPageButtonContainer} mt6`}>
            <Button
              variation="primary"
              disabled={!documentsValid || !tosAccepted || !pdfLoaded}
              isLoading={isLoading}
              onClick={() => handleContinueClick()}
            >
              <FormattedMessage id="store/flowFinance.accountCreate.submitApplication" />
            </Button>
          </div>
          {submitError && (
            <div className={`${handles.documentsPageErrorContainer} mt2 red`}>
              {submitError}
            </div>
          )}
        </div>
      )
    }
  }
}

export default injectIntl(DocumentsPage)
