import * as core from '@actions/core'
import {v4 as uuidv4} from 'uuid'
import axios from 'axios'
import axiosRetry from 'axios-retry'

const retryAttempt = 3

axiosRetry(axios, {
  retries: retryAttempt,
  retryDelay: retryCount => {
    core.info(`retrying to send pages telemetry with attempt: ${retryCount}`)
    return retryCount * 1000 // time interval between retries, with 1s, 2s, 3s
  },

  // retry on error greater than 500
  retryCondition: error => {
    console.log(error)
    console.log(error.response)
    return !error.response || error.response.status >= 500
  }
})

async function run(): Promise<void> {
  try {
    core.debug(`Reading action inputs`)
    const continueOnError = core.getBooleanInput('treat-error-as-warning')
    const applicationId = core.getInput('app-id')
    const apiKey = core.getInput('api-key')
    var name = core.getInput('name')

    try {
      core.debug(`Create the deployment annotation request`)
      const releaseProperties = {
        ServerUrl: process.env.GITHUB_SERVER_URL,
        Repository: process.env.GITHUB_REPOSITORY,
        Workflow: process.env.GITHUB_WORKFLOW,
        RunId: process.env.GITHUB_RUN_ID,
        RunNumber: process.env.GITHUB_RUN_NUMBER,
        Branch: process.env.GITHUB_REF_NAME,
        SHA: process.env.GITHUB_SHA,
        By: process.env.GITHUB_ACTOR,
        Message: process.env.GITHUB_
      }

      const body = {
        Id: uuidv4(),
        AnnotationName: name,
        EventTime: new Date().toISOString(),
        Category: 'Deployment',
        Properties: JSON.stringify(releaseProperties)
      }

      core.debug(`Locating Azure endpoint`)
      var endpoint = ''
      await axios
        .get(
          'http://go.microsoft.com/fwlink/?prd=11901&pver=1.0&sbp=Application%20Insights&plcid=0x409&clcid=0x409&ar=Annotations&sar=Create%20Annotation',
          {
            maxRedirects: 0,
            validateStatus: null
          }
        )
        .then(response => {
          if (response.headers?.location == undefined) {
            throw new Error(`Unable to locate the Azure endpoint (undefined)`)
          }
          endpoint = response.headers.location
          core.debug(`Locating Azure endpoint found: ` + endpoint)
        })
        .catch(err => {
          if (err.response.status !== 200) {
            throw new Error(
              `Failed to locate the Azure endpoint with status code: ${err.response.status} after ${retryAttempt} retry attempts`
            )
          }
        })

      core.debug(`Sending the deployment annotation request`)
      await axios
        .put(
          endpoint +
            '/applications/' +
            applicationId +
            '/Annotations?api-version=2015-11',
          body,
          {
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              'X-AIAPIKEY': apiKey
            }
          }
        )
        .catch(err => {
          if (err.response.status !== 200) {
            throw new Error(
              `Failed to create the deployment annotation with status code: ${err.response.status} after ${retryAttempt} retry attempts`
            )
          }
        })
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
