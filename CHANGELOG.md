# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- GitHub reusable workflow uptaded to v2

## [1.0.5] - 2022-05-17

### Fixed

- English and Portuguese translations.

### Added

- Quality engineering actions

## [1.0.4] - 2021-08-31

### Added

- Crowdin.yml file for crowdin integration

## [1.0.3] - 2020-07-01

### Fixed

- Update 0.x version references to 1.x

## [1.0.2] - 2020-06-26

### Fixed

- Update major number for app settings query.

## [1.0.1] - 2020-06-26

### Fixed

- Update API dependency.

## [1.0.0] - 2020-06-26

### Changed

- Update `processApplication` mutation to use `Upload` variables, allowing files to be sent as multipart form data.

## [0.0.12] - 2020-06-18

### Changed

- AccountCreatePage will check shopper's account status and forbid account signup if status is "approved", "rejected", or "under-review".

## [0.0.11] - 2020-06-02

### Fixed

- Validation error for phone number only appears after user leaves field

## [0.0.10] - 2020-06-01

### Changed

- Default installments for PDP promo message calculation is now 24 instead of 12
- PDP promo message wording changed

## [0.0.9] - 2020-06-01

### Added

- Additional CSS Handles

## [0.0.8] - 2020-05-28

### Changed

- Completely hide PromoMessage component if shopper's account status is "rejected"

## [0.0.7] - 2020-05-27

### Changed

- Address field validation behavior

## [0.0.6] - 2020-05-26

### Changed

- Message adjustments per Gympass

### Fixed

- Partial personal address is stored in state, in case user goes back to Business Info page and then returns to Personal Info page.

## [0.0.5] - 2020-05-21

### Fixed

- PDP promo message: Show link if account status is "pending"

## [0.0.4] - 2020-05-21

### Fixed

- Account signup form: Personal phone number error message now appears if phone number is too long.
- Account signup form: Phone numbers loaded from user profile will have `+55` country code automatically removed.
- Account signup form: `Nome Fantasia` (company trade name) will be loaded from user profile if present.

## [0.0.3] - 2020-05-20

### Fixed

- `address-form` validation is now done per field rather than all fields at once
- Account signup form modal does not close if user clicks outside of it

### Changed

- Various layout and message adjustments requested by Gympass
- Documentation

## [0.0.2] - 2020-05-11

### Fixed

- Styling for document upload page of account signup form

## [0.0.1] - 2020-05-11

### Added

- Initial release
