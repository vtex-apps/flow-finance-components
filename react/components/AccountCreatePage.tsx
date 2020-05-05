import React from 'react'
import { PageBlock } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import AccountCreate from './AccountCreate'

const CSS_HANDLES = [
  'accountCreatePageContainer',
  'accountCreatePageInnerContainer',
] as const

const AccountCreatePage: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { navigate } = useRuntime()

  async function handleExit() {
    navigate({ page: 'store.home' })
  }

  return (
    <div className={`${handles.accountCreatePageContainer} bg-muted-5 pa8`}>
      <div
        className={`${handles.accountCreatePageInnerContainer} m-auto`}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <PageBlock variation="full">
          <AccountCreate handleExit={handleExit} />
        </PageBlock>
      </div>
    </div>
  )
}

export default AccountCreatePage
