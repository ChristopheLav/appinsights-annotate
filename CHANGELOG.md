# Changelog

## v2.0.0

- You now need to use the [Azure Login action](https://github.com/marketplace/actions/azure-login) to handle the authentication instead of the [deprecated API keys](https://learn.microsoft.com/en-us/azure/azure-monitor/app/release-and-work-item-insights?tabs=release-annotations#create-release-annotations-with-the-azure-cli)
  - The v1 of the action will stop to work by 31 August 2024 due to this depreciation
- Bump dependencies to the last versions (see [full changelog](https://github.com/ChristopheLav/appinsights-annotate/compare/v1.1.0...v2.0.0))

## v1.1.0

- Upgrade action to use the Node 20 (Node 16 EOL)
- Bump dependencies to the last versions (see [full changelog](https://github.com/ChristopheLav/appinsights-annotate/compare/v1.0.2...v1.1.0))

## v1.0.2

- Bump @typescript-eslint/parser from 5.27.1 to 5.28.0 (#9)
- Bump @types/node from 16.11.39 to 16.11.41 (#10)
- Bump @actions/core from 1.8.2 to 1.9.0 (#11)
- Bump prettier from 2.6.2 to 2.7.0 (#12)

## v1.0.1

- Bump @typescript-eslint/parser from 5.27.0 to 5.27.1 (#5)
- Bump @types/node from 16.11.38 to 16.11.39 (#6)
- Improve workflows (check list + Dependabot) (#7)
- README fixes (#8)

## v1.0.0

Initial Release of the Application Insights Annotate action