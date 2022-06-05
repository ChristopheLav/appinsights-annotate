# Application Insights Annotate action

[![Build and Test](https://github.com/ChristopheLav/appinsights-annotate/actions/workflows/ci.yml/badge.svg)](https://github.com/ChristopheLav/appinsights-annotate/actions/workflows/ci.yml)

This action collect run metadata and publish a deployment annotation to Application Insights that allow to track deployments.

You need to set an annotation name, but the extension also publish automatically these properties:
- `ServerUrl` with value of `${{ github.server_url }}`
- `Repository` with value of `${{ github.repository }}`
- `Workflow` with value of `${{ github.workflow }}`
- `RunId` with value of `${{ github.run_id }}`
- `RunNumber` with value of `${{ github.run_number }}`
- `Branch` with value of `${{ github.ref_name }}`
- `SHA` with value of `${{ github.sha }}`
- `By` with value of `${{ github.actor }}`
- `Message` with value of `${{ github.event.head_commit.message }}`

![Example of a deployment annotation](imgs/deployment-annotation.png)

## What's new

Refer [here](CHANGELOG.md) to the changelog.

## Configuration

An API needs to be generated from the `API Access` tab on the Azure Portal with the permission `Write annotations`.

It is recommended to put the API Key into a GitHub secret to prevent clear value in your workflow.

## Usage

<!-- start usage -->
```yaml
- uses: ChristopheLav/appinsights-annotate@v3
  with:
    # The `Application ID` of the Application Insights resource (available in the
    # Azure Portal under `API Access`).
    app-id: ''

    # The API Key of the Application Insights resource. You can create an API Key in
    # the Azure Portal under `API Access` (`Wite annotations` permission is required).
    api-key: ''

    # Name of your deployment. You can set the version number or use the value
    # `github.event.head_commit.message` to set the last commit message.
    name: ''

    # Allows to treat error as warning to prevent worlflow failure. It is may not
    # important in some cases if the annocation can not be created.
    # Default: false
    treat-error-as-warning: ''
```
<!-- end usage -->

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)