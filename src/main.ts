import * as core from '@actions/core'

import {AuthorizerFactory} from 'azure-actions-webclient/AuthorizerFactory'

import {addAnnotation} from './utilities/AnnotationUtility'

async function run(): Promise<void> {
  try {
    core.debug(`Reading action inputs`)
    const continueOnError = core.getBooleanInput('treat-error-as-warning')
    const applicationId = core.getInput('app-id')
    const isDeploymentSuccess = core.getBooleanInput('is-deployment-succeed')
    const name = core.getInput('name')

    try {
      core.debug(`Get the Azure authorization context`)
      let endpoint
      try {
        endpoint = await AuthorizerFactory.getAuthorizer()
      } catch {
        throw new Error(
          'No credentials found. Please use the azure/login@v1 action before to attempt to create an Application Insights annotation.'
        )
      }

      core.debug(`Create the Application Insights deployment annotation`)
      addAnnotation(endpoint, applicationId, name, isDeploymentSuccess)
    } catch (error) {
      if (continueOnError) {
        core.warning(`${(error as any)?.message ?? error}`)
      } else {
        throw error
      }
    }
  } catch (error) {
    core.setFailed(`${(error as any)?.message ?? error}`)
  }
}

run()
