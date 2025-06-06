/* eslint-disable @typescript-eslint/no-explicit-any */

import * as core from '@actions/core'

import {
  ApplicationInsightsResources,
  AzureApplicationInsights
} from 'azure-actions-appservice-rest/Arm/azure-arm-appinsights'

import {IAuthorizer} from 'azure-actions-webclient/Authorizer/IAuthorizer'

import {v4 as uuidv4} from 'uuid'

export async function addAnnotation(
  endpoint: IAuthorizer,
  applicationId: string,
  deploymentName: string,
  isDeploymentSuccess: boolean
): Promise<void> {
  try {
    if (applicationId) {
      const appinsightsResources: ApplicationInsightsResources =
        new ApplicationInsightsResources(endpoint)
      const appInsightsResources = await appinsightsResources.list(undefined, [
        `$filter=AppId eq '${applicationId}'`
      ])
      if (appInsightsResources.length > 0) {
        const appInsightsId = appInsightsResources[0].id
        if (appInsightsId) {
          const appInsights: AzureApplicationInsights =
            new AzureApplicationInsights(
              endpoint,
              appInsightsId.split('/')[4],
              appInsightsResources[0].name
            )
          const releaseAnnotationData = getReleaseAnnotation(
            deploymentName,
            isDeploymentSuccess
          )
          await appInsights.addReleaseAnnotation(releaseAnnotationData)
          core.debug(
            `Successfully added release annotation to the Application Insight : ${appInsightsResources[0].name}`
          )
        } else {
          core.debug(
            `Invalid Application Insights resource. Skipping adding release annotation.`
          )
        }
      } else {
        throw Error(
          `Unable to find Application Insights resource with Instrumentation key ${applicationId}.`
        )
      }
    } else {
      throw Error(
        `Empty is not a valid value for ApplicationId to find an Application Insights resource.`
      )
    }
  } catch (error: any) {
    error.exception = 'FailedAddingReleaseAnnotation'
    throw error
  }
}

function getReleaseAnnotation(
  deploymentName: string,
  isDeploymentSuccess: boolean
): {[key: string]: any} {
  const releaseAnnotationProperties = {
    Label: isDeploymentSuccess ? 'Success' : 'Error', // Label decides the icon for annotation
    'Server Url': process.env.GITHUB_SERVER_URL,
    Repository: process.env.GITHUB_REPOSITORY,
    Workflow: process.env.GITHUB_WORKFLOW,
    'Run Id': process.env.GITHUB_RUN_ID,
    'Run Number': process.env.GITHUB_RUN_NUMBER,
    Branch: process.env.GITHUB_REF_NAME,
    SHA: process.env.GITHUB_SHA,
    By: process.env.GITHUB_ACTOR,
    'Event Name': process.env.GITHUB_EVENT_NAME,
    'Deployment Url': `https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}/checks`
  }

  const releaseAnnotation = {
    AnnotationName: deploymentName,
    Category: 'Deployment',
    EventTime: new Date(),
    Id: uuidv4(),
    Properties: JSON.stringify(releaseAnnotationProperties)
  }

  return releaseAnnotation
}
