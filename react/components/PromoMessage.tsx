import useProduct from 'vtex.product-context/useProduct'

import React, { useState, useEffect } from 'react'
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl'
import { useQuery } from 'react-apollo'
import { ButtonPlain, Modal } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import AccountCreate from './AccountCreate'
import Profile from '../graphql/Profile.graphql'

interface PromoProps {
  interestRate: number
  installments: number
}

const CSS_HANDLES = [
  'promoMessageContainer',
  'promoMessageMainText',
  'promoMessageLink',
  'promoMessageLinkText',
  'promoMessageSmallText',
] as const

const FlowFinancePromo: StorefrontFunctionComponent<PromoProps &
  WrappedComponentProps> = ({ interestRate, installments, intl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [showPromo, setShowPromo] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const { product, selectedItem } = useProduct()
  const { data, refetch } = useQuery(Profile)

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
        if (response.accountStatus !== 'rejected') {
          setShowPromo(true)
        }
        if (
          response.accountStatus === 'none' ||
          response.accountStatus === 'pending'
        )
          setShowLink(true)
      })
    }
  }, [data])

  if (!product || !selectedItem || !data) {
    return null
  }

  const price = selectedItem?.sellers[0].commertialOffer.Price

  function calculateInstallments(
    itemPrice: number,
    itemInterestRate: number,
    itemInstallments: number
  ) {
    if (!itemPrice || !itemInterestRate || !itemInstallments) return 0
    const pricePerInstallment =
      (itemPrice *
        (1 + itemInterestRate) ** itemInstallments *
        itemInterestRate) /
      ((1 + itemInterestRate) ** itemInstallments - 1)
    return intl.formatNumber(pricePerInstallment, {
      style: 'currency',
      currency: 'BRL',
    })
  }

  async function handleModalToggle() {
    setShowLink(false)
    setIsModalOpen(!isModalOpen)
    refetch().then((result: any) => {
      if (result?.data?.profile) {
        postData(`/_v/api/connectors/flow-finance/get-loan-options`, {
          email: result.data.profile.email,
          total: 1000,
        }).then(response => {
          if (response.accountStatus !== 'rejected') {
            setShowPromo(true)
          }
          if (
            response.accountStatus === 'none' ||
            response.accountStatus === 'pending'
          )
            setShowLink(true)
        })
      }
    })
  }

  if (showPromo)
    return (
      <div className={`${handles.promoMessageContainer} mt6 mb6`}>
        <span className={`${handles.promoMessageMainText}`}>
          <FormattedMessage
            id="store/flowFinance.productPromo.promoMessage"
            values={{
              installments,
              pricePerInstallment: calculateInstallments(
                price,
                interestRate,
                installments
              ),
            }}
          />
        </span>{' '}
        {showLink && (
          <ButtonPlain
            onClick={handleModalToggle}
            className={`${handles.promoMessageLink}`}
          >
            <span className={`${handles.promoMessageLinkText}`}>
              <FormattedMessage id="store/flowFinance.productPromo.promoMessageLinkText" />
            </span>
          </ButtonPlain>
        )}
        <div className={`${handles.promoMessageSmallText} t-mini`}>
          <FormattedMessage id="store/flowFinance.productPromo.promoMessageSmallText" />
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalToggle}
          closeOnOverlayClick={false}
        >
          <AccountCreate handleExit={handleModalToggle} />
        </Modal>
      </div>
    )

  return null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.flowFinance.promoMessageBlock.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.flowFinance.promoMessageBlock.description',
  },
  interestRateTitle: {
    defaultMessage: '',
    id: 'admin/editor.promoMessageBlock.interestRate.title',
  },
  installmentsTitle: {
    defaultMessage: '',
    id: 'admin/editor.promoMessageBlock.installments.title',
  },
})

FlowFinancePromo.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    interestRate: {
      title: messages.interestRateTitle.id,
      type: 'number',
      isLayout: false,
      default: 0.0149,
    },
    installments: {
      title: messages.installmentsTitle.id,
      type: 'number',
      isLayout: false,
      default: 24,
    },
  },
}
FlowFinancePromo.defaultProps = {
  interestRate: 0.0149,
  installments: 24,
}

export default injectIntl(FlowFinancePromo)
