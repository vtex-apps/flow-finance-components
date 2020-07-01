📢 Use this project, [contribute](https://github.com/vtex-apps/flow-finance-components) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Flow Finance Components

This app provides store components related to the [Flow Finance payment method](https://github.com/vtex-apps/flow-finance-payment): an account sign-up form and a promo message for the PDP.

:warning: The account sign-up form will not function unless the two [Flow Finance payment method](https://github.com/vtex-apps/flow-finance-payment) apps have been installed and configured (see instructions at link).

## Configuration

1. [Install](https://vtex.io/docs/recipes/store/installing-an-app) `vtex.flow-finance-components` in the desired account;
2. Upload a PDF containing the Terms & Conditions that shoppers must agree to when applying for a Flow Finance account to the location of your choice and make a note of the URL.
3. In the account's admin, access **Apps** and then select the **Flow Finance Components** box;
4. Input your `Store Name` and `Store-branded Payment Name`, as well as the URL of the `Terms & Conditions PDF` from step 2, and click Save;
5. Add this app as a dependency in your store-theme's `manifest.json`:

```json
"dependencies": {
    "vtex.flow-finance-components": "1.x"
  }
```

This app creates a new store route: `/flow-finance`, which hosts the Flow Finance account sign-up form.

This app also provides a `flow-finance-promo-message` block which can be added to the PDP and accepts the following props:

| Prop name      | Type     | Description                                                | Default value |
| -------------- | -------- | ---------------------------------------------------------- | ------------- |
| `interestRate` | `number` | Interest rate for loan estimate calculation (1.5% = 0.015) | `0.0149`      |
| `installments` | `number` | Number of installments for loan estimate                   | `12`          |

This block also includes a link which, when clicked, will open the Flow Finance account sign-up form as a modal directly on the PDP. The link is only shown if a shopper is logged in, and if they do not have a Flow Finance account.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| PDP Promo Message CSS Handles |
| ----------------------------- |
| `promoMessageContainer`       |
| `promoMessageMainText`        |
| `promoMessageLink`            |
| `promoMessageLinkText`        |
| `promoMessageSmallText`       |

| Account Sign-up CSS Handles        |
| ---------------------------------- |
| `accountCreateContainer`           |
| `accountCreatePageContainer`       |
| `accountCreatePageInnerContainer`  |
| `accountCreateStepsContainer`      |
| `accountCreateStep`                |
| `accountCreateStepNumberContainer` |
| `accountCreateStepNumber`          |
| `accountCreateStepLabel`           |
| `businessInfoPageContainer`        |
| `businessInfoInstructions`         |
| `businessInfoSection`              |
| `businessAddressSection`           |
| `businessInfoPageButtonContainer`  |
| `documentsPageContainer`           |
| `documentsPageInstructions`        |
| `documentTypesContainer`           |
| `documentTypeContainer`            |
| `documentTypeIcon`                 |
| `documentTypeLabel`                |
| `documentFilenameContainer`        |
| `documentFilenameText`             |
| `documentRemoveButton`             |
| `documentUploadButton`             |
| `documentUploadButtonText`         |
| `documentsPageButtonContainer`     |
| `documentsPageErrorContainer`      |
| `dropzoneContainer`                |
| `dropzoneRadioOptions`             |
| `dropzoneRadioOption`              |
| `dropzoneRadioOptionInput`         |
| `dropzoneRadioLabelText`           |
| `dropzoneErrorContainer`           |
| `dropzoneErrorIcon`                |
| `dropzoneErrorText`                |
| `dropzoneFilenameContainer`        |
| `dropzoneFilenameText`             |
| `dropzoneUploadContainer`          |
| `dropzoneUploadIcon`               |
| `dropzoneUploadInstructions`       |
| `dropzoneUploadButton`             |
| `dropzoneUploadButtonText`         |
| `introPageContainer`               |
| `introPageInstructions`            |
| `introPageTitle`                   |
| `introPageIconsContainer`          |
| `introPageLeftIconContainer`       |
| `introPageLeftIcon`                |
| `introPageLeftIconTitle`           |
| `introPageLeftIconText`            |
| `introPageRightIconContainer`      |
| `introPageRightIcon`               |
| `introPageRightIconTitle`          |
| `introPageRightIconText`           |
| `introPageButtonContainer`         |
| `introPageAccountErrorContainer`   |
| `personalInfoPageContainer`        |
| `personalInfoInstructions`         |
| `personalInfoSection`              |
| `personalContactSection`           |
| `personalAddressSection`           |
| `personalInfoPageButtonContainer`  |
| `poweredByContainer`               |
| `preQualifyPageContainer`          |
| `preQualifyInstructions`           |
| `preQualifySection`                |
| `preQualifyPageButtonContainer`    |
| `successPageContainer`             |
| `successPageTitle`                 |
| `successPageMessage`               |
| `successPageButtonContainer`       |
| `tosAcceptanceContainer`           |
| `tosAcceptanceCheckbox`            |
| `tosAcceptanceCheckboxLabel`       |
| `tosIframeContainer`               |
