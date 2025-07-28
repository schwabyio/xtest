////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//    xtest.js - Postman extended test.                                       //
//                                                                            //
//                  Created by: schwaby.io                                    //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function xtest() {
  'use strict'
  //Global Variables
  const version = '1.3.0'
  const xml2js = require('xml2js')
  const _ = require('lodash')
  var strictValidationEnabled = false
  var copyOfResponseStatusCode = 0
  var copyOfResponseReasonMessage = ''
  var copyOfResponseHeadersList = []
  var copyOfResponseTime = 0
  var copyOfResponseBodyObject = {}
  const INFINITY = 1 / 0
  const strftime = new strftimeModule()
  const timeZoneScheme = {}
  timeZoneScheme['A']   = '+0100'
  timeZoneScheme['B']   = '+0200'  //e.g. EET - Eastern European Time
  timeZoneScheme['C']   = '+0300'  //e.g. EEDT - Eastern European Daylight Time
  timeZoneScheme['D']   = '+0400'
  timeZoneScheme['E']   = '+0500'
  timeZoneScheme['IST'] = '+0530'  //IST Indian Standard Time (added due to support IST 30 minute offset time)
  timeZoneScheme['F']   = '+0600'
  timeZoneScheme['G']   = '+0700'
  timeZoneScheme['H']   = '+0800'  //e.g. AWST - Australian Western Standard Time
  timeZoneScheme['I']   = '+0900'  //e.g. AWDT - Australian Western Daylight Time
  timeZoneScheme['K']   = '+1000'  //e.g. AEST - Australian Eastern Standard Time
  timeZoneScheme['L']   = '+1100'  //e.g. AEDT - Australian Eastern Daylight Savings Time
  timeZoneScheme['M']   = '+1200'  //e.g. NZST - New Zealand Standard Time
  timeZoneScheme['N']   = '-0100'
  timeZoneScheme['O']   = '-0200'
  timeZoneScheme['P']   = '-0300'
  timeZoneScheme['Q']   = '-0400'  //e.g. EDT - Eastern Daylight Time (North America)
  timeZoneScheme['R']   = '-0500'  //e.g. CDT - Central Daylight Time (North America)
  timeZoneScheme['S']   = '-0600'  //e.g. CST - Central Standard Time (North America)
  timeZoneScheme['T']   = '-0700'  //e.g. PDT - Pacific Daylight Time (North America)
  timeZoneScheme['U']   = '-0800'  //e.g. PST - Pacific Standard Time (North America)
  timeZoneScheme['V']   = '-0900'  //e.g. HADT - Hawaii-Aleutian Daylight Time
  timeZoneScheme['W']   = '-1000'  //e.g. HST - Hawaii Standard Time
  timeZoneScheme['X']   = '-1100'
  timeZoneScheme['Y']   = '-1200'
  timeZoneScheme['Z']   = '+0000'  //e.g. GMT - Greenwich Mean Time


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.startXTest = function startXTest(pm, useStrictValidation) {
    var contentType = ''
    const responseBodyAsString = pm.response.text() || ''

    logInfo("Starting xtest version: " + version)

    if (useStrictValidation === "true" || useStrictValidation === true) {
      strictValidationEnabled = true
    } else {
      strictValidationEnabled = false
    }

    //Set copyOfResponseStatusCode
    copyOfResponseStatusCode = pm.response.code

    //Set copyOfResponseReasonMessage
    copyOfResponseReasonMessage = pm.response.reason

    //Set copyOfResponseHeadersList
    copyOfResponseHeadersList = JSON.parse(JSON.stringify(pm.response.headers))

    //Set copyOfResponseTime
    copyOfResponseTime = pm.response.responseTime

    //Extract contentType header to identify how to parse response
    copyOfResponseHeadersList.forEach(function(item) {
      if (item.key.toLowerCase() === 'content-type') {
        contentType = item.value.toLowerCase()
      }
    })

    //Set copyOfResponseBodyObject, only parse non-empty responseBodyAsString
    if (responseBodyAsString !== '') {
      if (/^application\/(.*)json/.test(contentType)) {
        //Parse json
        try {
          copyOfResponseBodyObject = JSON.parse(responseBodyAsString)
        } catch (e) {
          internalFail("ERROR parsing json response: " + e.message)
        }
      } else if ( (/^application\/(.*)xml/.test(contentType)) || (/^text\/(.*)xml/.test(contentType)) ) {
        //Parse xml
        xml2js.parseString(responseBodyAsString, {explicitArray: false, async: false}, function (err, result) {
          if (err) {
            internalFail("ERROR parsing xml response to json: " + err.message)
          } else {
            //Remove all xmlns data
            removeAllXmlNameSpaceData(result)

            copyOfResponseBodyObject = JSON.parse(JSON.stringify(result))

            logInfo("xtest: xml converted to json: " + JSON.stringify(copyOfResponseBodyObject, null, 2))
          }
        })
      } else if ( /^text\/(.*)plain/.test(contentType) ) {
        //plaintext
        copyOfResponseBodyObject = {}
        copyOfResponseBodyObject['plaintext'] = responseBodyAsString
  
        logInfo("xtest: plaintext converted to json: " + JSON.stringify(copyOfResponseBodyObject, null, 2))
      } else {
        logWarn("WARN xtest unsupported contentType: " + contentType)
      }
    } else {
      //responseBodyAsString is empty
      copyOfResponseBodyObject = {}
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.expectResponseStatusCodeToBe = function expectResponseStatusCodeToBe(expectedValue, specialHandling) {
    var regExpTrue = (expectedValue instanceof RegExp)
    var assertionDescriptionPrefix = "RESPONSE STATUS CODE"
    var environmentVariableKey = ''
    var collectionVariableKey = ''
    var validationResult = false


    if (specialHandling === 'setAsEnvironmentVariable') {
      environmentVariableKey = expectedValue
      pm.environment.set(environmentVariableKey, copyOfResponseStatusCode)

      assertionPass(assertionDescriptionPrefix, "The responseStatusCode '" + copyOfResponseStatusCode + "' was applied to the environmentVariableKey '" + environmentVariableKey + "'.")

      //All done, return
      return

    } else if (specialHandling === 'setAsCollectionVariable') {
      collectionVariableKey = expectedValue
      pm.collectionVariables.set(collectionVariableKey, copyOfResponseStatusCode)

      assertionPass(assertionDescriptionPrefix, "The responseStatusCode '" + copyOfResponseStatusCode + "' was applied to the collectionVariableKey '" + collectionVariableKey + "'.")

      //All done, return
      return

    }


    //RegExp validation
    if (regExpTrue === true) {
      //Compare using RegExp
      validationResult = expectedValue.test(copyOfResponseStatusCode)

      //Special handling:
      if (specialHandling === 'notThisExpectedValue') {
        //Toggle validationResult
        validationResult = (! validationResult)

        if (validationResult === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + ": Response status code with RegExp '" + expectedValue + "' correctly did NOT match the actualValue '" + copyOfResponseStatusCode + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": Response status code with RegExp '" + expectedValue + "' INCORRECTLY DID match actualValue '" + copyOfResponseStatusCode + "'.")
        }
      } else {
        if (validationResult === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + ": Response status code with RegExp expectedValue '" + expectedValue + "' correctly matched actualValue '" + copyOfResponseStatusCode + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": Response status code with RegExp expectedValue '" + expectedValue + "' INCORRECTLY did NOT match actualValue '" + copyOfResponseStatusCode + "'.")
        }
      }
      //Regular validation
    } else {
      //Compare exact match
      validationResult = exactComparison(expectedValue, copyOfResponseStatusCode)

      if (specialHandling === 'notThisExpectedValue') {
        //Toggle validationResult
        validationResult = (! validationResult)

        if (validationResult === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + ": Response status code with '" + expectedValue + "' correctly did NOT match the actualValue '" + copyOfResponseStatusCode + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": Response status code with '" + expectedValue + "' INCORRECTLY DID match actualValue '" + copyOfResponseStatusCode + "'.")
        }
      } else {
        if (validationResult === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + ": Response status code with expectedValue '" + expectedValue + "' correctly matched actualValue '" + copyOfResponseStatusCode + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": Response status code with expectedValue '" + expectedValue + "' INCORRECTLY did NOT match actualValue '" + copyOfResponseStatusCode + "'.")
        }
      }
    }

  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.expectResponseToHaveHeader = function expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue, specialHandling) {
    var assertionDescriptionPrefix = "RESPONSE HEADER"
    var actualHeaderKey = ''
    var actualHeaderValue = ''
    var matchFlag = false
    var matchedActualHeaderKey = ''
    var matchedActualHeaderValue = ''
    var regExpTrue = (expectedHeaderValue instanceof RegExp)
    var regExpDescriptionString = ''
    var environmentVariableKey = ''
    var collectionVariableKey = ''
    var storedActualHeaderValue = ''


    //Set regExpDescriptionString
    if (regExpTrue === true) {
      regExpDescriptionString = " (as a regular expression) "
    } else {
      regExpDescriptionString = ''
    }

    //Loop over all response headers and check for a match
    copyOfResponseHeadersList.some(function(item) {
      actualHeaderKey = item.key
      actualHeaderValue = item.value

      if (specialHandling === 'notThisExpectedKey') {
        //Special handling validation: notThisExpectedKey

        //Match only expectedHeaderKey (negation will take place below outside of loop)
        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          matchFlag = true
          matchedActualHeaderKey = actualHeaderKey

          //Break out of some loop
          return true
        }
      } else if (specialHandling === 'notThisExpectedValue') {
        //Match both expectedHeaderKey and expectedHeaderValue (negation will take place below outside of loop)
        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          //Need to store actualHeaderValue
          storedActualHeaderValue = actualHeaderValue

          if (regExpTrue === true) {
            if (expectedHeaderValue.test(actualHeaderValue) === true) {
              matchFlag = true

              matchedActualHeaderKey = actualHeaderKey
              matchedActualHeaderValue = actualHeaderValue

              //Break out of some loop
              return true
            }
          } else {
            if ( expectedHeaderValue === actualHeaderValue ) {
              matchFlag = true

              matchedActualHeaderKey = actualHeaderKey
              matchedActualHeaderValue = actualHeaderValue

              //Break out of some loop
              return true
            }
          }
        }
      } else if (specialHandling === 'setAsEnvironmentVariable') {

        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          matchFlag = true

          environmentVariableKey = expectedHeaderValue
          pm.environment.set(environmentVariableKey, actualHeaderValue)

          //Break out of some loop
          return true
        }
      } else if (specialHandling === 'setAsCollectionVariable') {

        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          matchFlag = true

          collectionVariableKey = expectedHeaderValue
          pm.collectionVariables.set(collectionVariableKey, actualHeaderValue)

          //Break out of some loop
          return true
        }
      } else if ( expectedHeaderValue === undefined ) {
        //Just attempt to match header key (ignore value)

        //Match only expectedHeaderKey
        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          matchFlag = true
          matchedActualHeaderKey = actualHeaderKey

          //Break out of some loop
          return true
        }
      } else {
        //Attempt to match header key and header value

        if (expectedHeaderKey.toLowerCase() === actualHeaderKey.toLowerCase()) {
          if (regExpTrue === true) {
            //Match expectedHeaderValue as RegExp

            if ( expectedHeaderValue.test(actualHeaderValue) === true ) {
              matchFlag = true

              matchedActualHeaderKey = actualHeaderKey
              matchedActualHeaderValue = actualHeaderValue

              //Break out of some loop
              return true
            }
          } else {
            //Match both expectedHeaderKey and expectedHeaderValue as exact value

            if (expectedHeaderValue === actualHeaderValue) {
              matchFlag = true

              matchedActualHeaderKey = actualHeaderKey
              matchedActualHeaderValue = actualHeaderValue

              //Break out of some loop
              return true
            }
          }
        }
      }
    })


    //Toggle matchFlag for notThisExpectedKey OR notThisExpectedValue
    if ( (specialHandling === 'notThisExpectedKey') || (specialHandling === 'notThisExpectedValue') ) {
      matchFlag = (! matchFlag)
    }


    //Set assertion pass or fail
    if (specialHandling === 'notThisExpectedKey') {
      //Special handling validation: notThisExpectedKey
      if (matchFlag === true) {
        assertionPass(assertionDescriptionPrefix, "The header key with notThisExpectedKey '" + expectedHeaderKey + "' correctly did NOT match any response header keys.")
      } else {
        assertionFail(assertionDescriptionPrefix, "The header key with notThisExpectedKey '" + expectedHeaderKey + "' INCORRECTLY DID match a response header key.")
      }
    } else if (specialHandling === 'notThisExpectedValue') {
      if (regExpTrue === true) {
        //With regular expression
        if (matchFlag === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + " : For header key '" + expectedHeaderKey + "', the header value with a RegExp '" + expectedHeaderValue + "' correctly did NOT match the actual header value of '" + storedActualHeaderValue + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": For header key '" + expectedHeaderKey + "', the header value with a RegExp '" + expectedHeaderValue + "' INCORRECTLY DID match the actual header value of '" + storedActualHeaderValue + "'.")
        }
      } else {
        //Without regular expression
        if (matchFlag === true) {
          assertionPass(assertionDescriptionPrefix, specialHandling + ": For header key '" + expectedHeaderKey + "', the header value with '" + expectedHeaderValue + "' correctly did NOT match the actual header value of '" + storedActualHeaderValue + "'.")
        } else {
          assertionFail(assertionDescriptionPrefix, specialHandling + ": For header key '" + expectedHeaderKey + "', the header value with '" + expectedHeaderValue + "' INCORRECTLY DID match the actual header value of '" + storedActualHeaderValue + "'.")
        }
      }
    } else if (specialHandling === 'setAsEnvironmentVariable') {
      //Special handling validation: setAsEnvironmentVariable
      if (matchFlag === true) {
        assertionPass(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' matched an actual response header key and applied the setAsEnvironmentVariable specialHandling using the environmentVariableKey: '" + environmentVariableKey + "'")
      } else {
        assertionFail(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' did NOT match an actual response header key (unable to apply the setAsEnvironmentVariable specialHandling): " + JSON.stringify(copyOfResponseHeadersList))
      }
    } else if (specialHandling === 'setAsCollectionVariable') {
      //Special handling validation: setAsCollectionVariable
      if (matchFlag === true) {
        assertionPass(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' matched an actual response header key and applied the setAsCollectionVariable specialHandling using the collectionVariableKey: '" + collectionVariableKey + "'")
      } else {
        assertionFail(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' did NOT match an actual response header key (unable to apply the setAsCollectionVariable specialHandling): " + JSON.stringify(copyOfResponseHeadersList))
      }
    } else if ( expectedHeaderValue === undefined ) {
      //Just attempt to match header key (ignore value)
      if (matchFlag === true) {
        assertionPass(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' matched an actual response header key (but not validating the header value).")
      } else {
        assertionFail(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' did NOT match an actual response header key: " + JSON.stringify(copyOfResponseHeadersList))
      }
    } else {
      //Attempt to match header key and header value
      if (regExpTrue === true) {
        //Match expectedHeaderValue as RegExp
        if (matchFlag === true) {
          assertionPass(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' and expectedHeaderValue (as a regular expression) '" + expectedHeaderValue + "' matched an actual response header key and value.")
        } else {
          assertionFail(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' and expectedHeaderValue (as a regular expression) '" + expectedHeaderValue + "' did NOT match an actual response header key and value: " + JSON.stringify(copyOfResponseHeadersList))
        }
      } else {
        //Match both expectedHeaderKey and expectedHeaderValue as exact value
        if (matchFlag === true) {
          assertionPass(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' and expectedHeaderValue '" + expectedHeaderValue + "' matched an actual response header key and value.")
        } else {
          assertionFail(assertionDescriptionPrefix, "The expectedHeaderKey '" + expectedHeaderKey + "' and expectedHeaderValue '" + expectedHeaderValue + "' did NOT match an actual response header key and value: " + JSON.stringify(copyOfResponseHeadersList))
        }
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.expectResponseBodyToHaveProperty = function expectResponseBodyToHaveProperty(jsonPathToProperty, expectedValue, specialHandling) {
    var assertionDescriptionPrefix = "RESPONSE BODY"
    var actualValue = getObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)
    var testResult = {}

    if (specialHandling === 'notThisExpectedKey') {
      if (actualValue === undefined) {
        //PASS: notThisExpectedKey and actualValue undefined
        assertionPass(assertionDescriptionPrefix, "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey correctly does NOT exist.")
      } else {
        assertionFail(assertionDescriptionPrefix, "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey INCORRECTLY exists and has actualValue '" + actualValue + "'.")
      }
    } else {
      if (actualValue !== undefined) {
        testResult = testExpectedValueWithActualValue(expectedValue, actualValue, specialHandling, jsonPathToProperty)
        if (testResult['passed'] === true) {
          assertionPass(assertionDescriptionPrefix, testResult['description'])

          //Delete jsonPathToProperty from copyOfResponseBodyObject
          deleteObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)
        } else {
          assertionFail(assertionDescriptionPrefix, testResult['description'])
        }
      } else {
        //FAIL: Unable to locate property based on jsonPathToProperty
        assertionFail(assertionDescriptionPrefix, "RESPONSE BODY - RESULT FAIL: Unable to locate property '" + jsonPathToProperty + "' in json response body: " + JSON.stringify(copyOfResponseBodyObject))
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.expectResponseBodyToHaveUnorderedArray = function expectResponseBodyToHaveUnorderedArray(jsonPathToArray, validationList) {
    var assertionDescriptionPrefix = "RESPONSE BODY (UNORDERED ARRAY)"
    var copyOfUnorderedArrayToValidate = JSON.parse(JSON.stringify(getObjectValueByPath(copyOfResponseBodyObject, jsonPathToArray), null, 0))
    var actualValue = undefined
    var pathToProperty = ''
    var expectedValue = undefined
    var specialHandling = undefined
    var jsonPathToProperty = ''
    var testDescriptionExpectedValue = ''
    var testDescriptionSpecialHandling = ''
    var testResult = {}
    var i = 0
    var j = 0
    var matchFound = false
    var allItemsMatch = false
    var arrayIndexMatch = 0
    var jsonBasePathToArray = jsonPathToArray


    if ( (validationList instanceof Array) === false) {
      //FAIL: User error
      assertionFail(assertionDescriptionPrefix, "Oops, expectResponseBodyToHaveUnorderedArray() error: 'validationList' provided is not of type Array.")
      return
    }

    //Only continue if copyOfUnorderedArrayToValidate was located and is an array
    if (copyOfUnorderedArrayToValidate instanceof Array) {
      if (! validationList[0].hasOwnProperty('pathToProperty')) {
        assertionDescriptionPrefix = "RESPONSE BODY (UNORDERED SIMPLE ARRAY)"

        //Validating an unordered simple array
        for (i = 0; i < validationList.length; i++) {
          expectedValue = validationList[i]

          for (j = 0; j < copyOfUnorderedArrayToValidate.length; j++) {
            actualValue = copyOfUnorderedArrayToValidate[j]

            if (actualValue === expectedValue) {
              const fullPath = joinBasePathAndIndex(jsonBasePathToArray, j)

              //PASS
              assertionPass(assertionDescriptionPrefix, "Found a match of expectedValue '" + expectedValue + "' with actualValue at propertyPath: '" + fullPath + "'.")

              //Delete jsonPathToArray item from copyOfResponseBodyObject
              deleteObjectValueByPath(copyOfResponseBodyObject, fullPath)

              matchFound = true
              break
            } else {
              matchFound = false
            }
          }

          if (matchFound === false) {
            //FAIL
            assertionFail(assertionDescriptionPrefix, "No match found for expectedValue '" + expectedValue + "' within jsonPathToArray: '" + jsonBasePathToArray + "'.")
          }
        }
      } else {
        //Iterate over validationList to see if any items have specialHandling = `notThisExpectedValue`
        var notThisExpectedValueFlag = false
        for (j = 0; j < validationList.length; j++) {
          if (validationList[j].hasOwnProperty('specialHandling')) {
            if (validationList[j]['specialHandling']  === 'notThisExpectedValue') {
              notThisExpectedValueFlag = true
              break
            }
          }
        }
        
        //If strictValidationEnabled = false and specialHandling = `notThisExpectedValue` we need to validate differently
        if (strictValidationEnabled === false && notThisExpectedValueFlag === true) {
          //This block requires a different type of validation when 1. strictValidationEnabled = false and 2. specialHandling = `notThisExpectedValue`

          if (validationList.length > 1) {
            //FAIL: User error
            assertionFail(assertionDescriptionPrefix, "Oops, expectResponseBodyToHaveUnorderedArray() error: Only 1 assertion item is allowd in validationList when using strictValidationEnabled = false and specialHandling = 'notThisExpectedValue'.")
            return
          }

          for (j = 0; j < validationList.length; j++) {
            //Required: pathToProperty
            if ( (validationList[j].hasOwnProperty('pathToProperty')) && (validationList[j]['pathToProperty'] !== "") ) {
              pathToProperty = validationList[j]['pathToProperty']
            } else {
              //FAIL: User error
              assertionFail(assertionDescriptionPrefix, "Oops, expectResponseBodyToHaveUnorderedArray() error: Missing required 'pathToProperty' in validationList item '" + j + "'.")
              return
            }

            //Optional: expectedValue
            if (validationList[j].hasOwnProperty('expectedValue')) {
              expectedValue = validationList[j]['expectedValue']
            } else {
              expectedValue = undefined
            }

            //Optional: specialHandling
            if (validationList[j].hasOwnProperty('specialHandling')) {
              specialHandling = validationList[j]['specialHandling']
            } else {
              specialHandling = undefined
            }


            //Validating an unordered array of objects
            for (i = 0; i < copyOfUnorderedArrayToValidate.length; i++) {
              jsonPathToProperty = joinBasePathIndexAndPathToProperty(jsonBasePathToArray, i, pathToProperty)

              actualValue = getObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)

              testResult = testExpectedValueWithActualValue(expectedValue, actualValue, specialHandling, jsonPathToProperty)

              if (testResult['passed'] === false) {
                //FAIL
                assertionFail(assertionDescriptionPrefix, testResult['description'])
                return
              }
            }

            //If we made it here, test passed
            assertionPass(assertionDescriptionPrefix, "With specialHandling = 'notThisExpectedValue' and strictValidationEnabled = false, expectedValue '" + expectedValue + "' with pathToProperty '" + pathToProperty + "' was successfully NOT FOUND in any of the response array objects.")
          }

        } else {
          //This block is the normal way of validating expectResponseBodyToHaveUnorderedArray

          //Validating an unordered array of objects
          for (i = 0; i < copyOfUnorderedArrayToValidate.length; i++) {

            const numberOfArrayItemsToValidate = getObjectPropertyCount(cleanObjectExceptEmptyString(copyOfUnorderedArrayToValidate[i]))

            for (j = 0; j < validationList.length; j++) {

              //Quick check when strictValidationEnabled
              if (strictValidationEnabled === true) {
                //Can quickly break out of loop if counts do not match
                if (numberOfArrayItemsToValidate !== validationList.length) {
                  //console.log(`No need to continue with loop: numberOfArrayItemsToValidate (${numberOfArrayItemsToValidate}) does not match validationList.length (${validationList.length})`)
                  matchFound = false
                  break
                } else {
                  //console.log(`Continue with loop: numberOfArrayItemsToValidate (${numberOfArrayItemsToValidate}) does match validationList.length (${validationList.length})`)
                }
              }

              //Required: pathToProperty
              if ( (validationList[j].hasOwnProperty('pathToProperty')) && (validationList[j]['pathToProperty'] !== "") ) {
                pathToProperty = validationList[j]['pathToProperty']
              } else {
                //FAIL: User error
                assertionFail(assertionDescriptionPrefix, "Oops, expectResponseBodyToHaveUnorderedArray() error: Missing required 'pathToProperty' in validationList item '" + j + "'.")
                return
              }

              //Optional: expectedValue
              if (validationList[j].hasOwnProperty('expectedValue')) {
                expectedValue = validationList[j]['expectedValue']
              } else {
                expectedValue = undefined
              }

              //Optional: specialHandling
              if (validationList[j].hasOwnProperty('specialHandling')) {
                specialHandling = validationList[j]['specialHandling']
              } else {
                specialHandling = undefined
              }

              jsonPathToProperty = joinBasePathIndexAndPathToProperty(jsonBasePathToArray, i, pathToProperty)

              actualValue = getObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)

              //Support notThisExpectedKey
              if (specialHandling === 'notThisExpectedKey') {
                if (actualValue === undefined) {
                  testResult['passed'] = true
                  testResult['description'] = "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey correctly does NOT exist."
                  matchFound = true
                } else {
                  testResult['passed'] = false
                  testResult['description'] = "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey INCORRECTLY exists and has actualValue '" + actualValue + "'."
                  matchFound = false
                  break
                }
              } else {
                if (actualValue !== undefined) {
                  
                  testResult = testExpectedValueWithActualValue(expectedValue, actualValue, specialHandling, jsonPathToProperty)
                  
                  if (testResult['passed'] === true) {
                    matchFound = true
                  } else {
                    matchFound = false
                    break
                  }
                } else {
                  matchFound = false
                  break
                }
              }
            }

            if (matchFound === true) {
              //Match found, all done
              allItemsMatch = true
              arrayIndexMatch = i
              break
            } else {
              //No match found, try next array index
              allItemsMatch = false
            }
          }

          if (allItemsMatch === true) {
            //PASS
            for (j = 0; j < validationList.length; j++) {
              //Required: pathToProperty
              pathToProperty = validationList[j]['pathToProperty']

              //Optional: expectedValue
              if (validationList[j].hasOwnProperty('expectedValue')) {
                expectedValue = validationList[j]['expectedValue']
              } else {
                expectedValue = undefined
              }

              //Optional: specialHandling
              if (validationList[j].hasOwnProperty('specialHandling')) {
                specialHandling = validationList[j]['specialHandling']
              } else {
                specialHandling = undefined
              }

              jsonPathToProperty = joinBasePathIndexAndPathToProperty(jsonBasePathToArray, arrayIndexMatch, pathToProperty)

              actualValue = getObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)

              //Support for notThisExpectedKey
              if (specialHandling === 'notThisExpectedKey') {
                if (actualValue === undefined) {
                  testResult['passed'] = true
                  testResult['description'] = "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey correctly does NOT exist."
                } else {
                  testResult['passed'] = false
                  testResult['description'] = "The jsonPathToProperty '" + jsonPathToProperty + "' with notThisExpectedKey INCORRECTLY exists and has actualValue '" + actualValue + "'."
                }
              } else {
                testResult = testExpectedValueWithActualValue(expectedValue, actualValue, specialHandling, jsonPathToProperty)
              }

              assertionPass(assertionDescriptionPrefix, testResult['description'])

              //Delete jsonPathToProperty from copyOfResponseBodyObject
              deleteObjectValueByPath(copyOfResponseBodyObject, jsonPathToProperty)
            }
          } else {
            //FAIL
            for (j = 0; j < validationList.length; j++) {
              //Required: pathToProperty
              pathToProperty = validationList[j]['pathToProperty']

              //Optional: expectedValue
              if (validationList[j].hasOwnProperty('expectedValue')) {
                expectedValue = validationList[j]['expectedValue']
                testDescriptionExpectedValue = " expectedValue: '" + expectedValue + "'"
              } else {
                expectedValue = undefined
                testDescriptionExpectedValue = ''
              }

              //Optional: specialHandling
              if (validationList[j].hasOwnProperty('specialHandling')) {
                specialHandling = validationList[j]['specialHandling']
                testDescriptionSpecialHandling = " specialHandling: '" + specialHandling + "'"
              } else {
                specialHandling = undefined
                testDescriptionSpecialHandling = ''
              }

              assertionFail(assertionDescriptionPrefix, "pathToProperty: '" + pathToProperty + "'" + testDescriptionExpectedValue + testDescriptionSpecialHandling + ".")
            }
          }
        }
      }
    } else {
      //FAIL: Array not found based on jsonPathToArray
      assertionFail(assertionDescriptionPrefix, "Unable to locate Array given jsonPathToArray '" + jsonBasePathToArray + "' in json response body: " + JSON.stringify(copyOfResponseBodyObject))
      return
    }


    //////////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////////
    function getObjectPropertyCount(obj) {
      const propertyList = []

      iterate(obj, '')

      return propertyList.length

      function iterate(obj, stack) {

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object") {
                    iterate(obj[property], stack + '.' + property)
                } else {
                    //console.log(property + "   " + obj[property])
                    propertyList.push(property + "   " + obj[property])
                }
            }
        }
      }
    }


    //////////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////////
    function joinBasePathAndIndex(jsonBasePathToArray, index) {
      if (Array.isArray(jsonBasePathToArray)) {
        //Return joined array
        var newArray = JSON.parse(JSON.stringify(jsonBasePathToArray))
        var indexAsString = index.toString()

        newArray.push(indexAsString)

        return newArray
      } else {
        var joinValue = jsonBasePathToArray === '' ? '' : '.'

        //Return joined path (string)
        var newFullPath = jsonBasePathToArray + joinValue + index.toString()

        return newFullPath
      }
    }


    //////////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////////
    function joinBasePathIndexAndPathToProperty(jsonBasePathToArray, index, pathToProperty) {
      if (Array.isArray(pathToProperty)) {
        //If pathToProperty is an array then everything must be an array
        var newJoinedPathAsArray = getPathAsArray(jsonBasePathToArray)

        //Add index
        newJoinedPathAsArray.push(index.toString())

        //Add pathToProperty
        pathToProperty.forEach(function(item) {
          newJoinedPathAsArray.push(item.toString())
        })

        return newJoinedPathAsArray
      } else {
        var joinValue = jsonBasePathToArray === '' ? '' : '.'

        //If pathToProperty is a string then everything must be a string
        var newJoinedPathAsString = getPathAsString(jsonBasePathToArray)

        //Add index
        newJoinedPathAsString += joinValue + index.toString()

        //Add pathToProperty
        newJoinedPathAsString += '.' + pathToProperty

        return newJoinedPathAsString
      }
    }


    //////////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////////
    function getPathAsArray(path) {
      if (Array.isArray(path)) {
        return path
      } else {
        if (path.indexOf('.') >= 0) {
          return path.split(".")
        } else {
          return [path]
        }
      }
    }


    //////////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////////
    function getPathAsString(path) {
      if (Array.isArray(path)) {
        var newPathAsString = ''

        path.forEach(function(item) {
          newPathAsString += '.' + item
        })

        return newPathAsString
      } else {
        return path
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.endXTest = function endXTest() {
    var assertionDescriptionPrefix = 'STRICT RESPONSE VALIDATION'

    if (strictValidationEnabled === true) {
      //Clean object
      cleanObject(copyOfResponseBodyObject)

      //Check that copyOfResponseBodyObject is now empty
      if (Object.keys(copyOfResponseBodyObject).length === 0) {
        assertionPass(assertionDescriptionPrefix, "All response json body items have been properly validated.")
      } else {
        assertionFail(assertionDescriptionPrefix, "Still have the following non-validated response json body items: " + JSON.stringify(copyOfResponseBodyObject))
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  this.date = function date(dateFormat, secondsOffset, timeZone) {
    //Validate dateFormat
    if (! dateFormat) {
      return "Oops, not a valid dateFormat value: " + dateFormat
    }

    //Validate secondsOffset
    if (isNotValidInteger(secondsOffset)) {
      return "Oops, not a valid secondsOffset value: " + secondsOffset
    }

    //Validate timeZone
    if (! timeZoneScheme.hasOwnProperty(timeZone)) {
      return "Oops, not a valid timeZoneScheme value: " + timeZone
    }

    //Generate formattedDateTime
    var formatDate = strftime.timezone(timeZoneScheme[timeZone])
    return formatDate(dateFormat, new Date(Date.now() + (secondsOffset * 1000)))
  }


  //////////////////////////////////////////////////////////////////////////////
  //                        ALL SUPPORT FUNCTIONS BELOW                       //
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function getVersion() {
    return version
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function logInfo(data) {

    console.info(data)
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function logWarn(data) {

    console.warn(data)
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function logError(data) {

    console.error(data)
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function assertionPass(assertionDescriptionPrefix, assertionDescriptionSuffix) {

    pm.test(assertionDescriptionPrefix + " - RESULT PASS: " + assertionDescriptionSuffix, function () {
      pm.expect(true).to.equal(true)
    })
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function assertionFail(assertionDescriptionPrefix, assertionDescriptionSuffix) {

    pm.test(assertionDescriptionPrefix + " - RESULT FAIL: " + assertionDescriptionSuffix, function () {
      pm.expect.fail("xtest assertion failed!")
    })
  }

  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function internalFail(failureMessage) {

    pm.test("XTEST INTERNAL FAILURE: " + failureMessage, function () {
      pm.expect.fail("xtest internal failure.")
    })
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function exactComparison(expectedValue, actualValue) {

    if (expectedValue === actualValue) {
      return true
    } else {
      return false
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function testExpectedValueWithActualValue(expectedValue, actualValue, specialHandling, jsonPathToProperty) {
    var testResult = {}
    testResult['passed'] = false
    testResult['description'] = ''
    var regExpTrue = (expectedValue instanceof RegExp)
    var timeParameter = 0
    var actualValueAsDateString = ''
    var expectedValueAsDateString = ''
    var secondsOffset = 0
    var dateString = ''
    var environmentVariableKey = ''
    var environmentVariableValue = ''
    var collectionVariableKey = ''
    var collectionVariableValue = ''

    //Special handling validation
    if (specialHandling !== undefined) {
      if (specialHandling === 'dateAsEpoch') {
        timeParameter = expectedValue

        if (typeof timeParameter === 'number') {
          secondsOffset = timeParameter

          //Validate secondsOffset
          if (isNotValidInteger(secondsOffset)) {
            //FAIL: User error
            testResult['passed'] = false
            testResult['description'] = "Oops, function error: not a valid secondsOffset value: " + secondsOffset
            return testResult
          }

          //Set expectedValueAsDateString
          expectedValueAsDateString = getDateYMD(Date.now() + (secondsOffset * 1000))
        } else if (typeof timeParameter === 'string') {
          dateString = timeParameter

          expectedValueAsDateString = dateString.substring(0, 10)
        } else {
          //FAIL: User error
          testResult['passed'] = false
          testResult['description'] = "Oops, function error: not a valid timeParameter value: " + timeParameter
          return testResult
        }

        //Set actualValueAsDateString
        actualValueAsDateString = getDateYMD(actualValue)

        //Compare expectedValue with actualValue
        if (expectedValueAsDateString === actualValueAsDateString) {
          //PASS: expectedValue matched actualValue
          testResult['passed'] = true
          testResult['description'] = "dateAsEpoch: Property '" + jsonPathToProperty + "' with expectedValueAsDateString '" + expectedValueAsDateString + "' matched actualValueAsDateString (converted from epoch format) '" + actualValueAsDateString + "'."
          return testResult
        } else {
          //FAIL: expectedValue did not match actualValue
          testResult['passed'] = false
          testResult['description'] = "dateAsEpoch: Property '" + jsonPathToProperty + "' with expectedValueAsDateString '" + expectedValueAsDateString + "' did NOT match actualValueAsDateString (converted from epoch format) '" + actualValueAsDateString + "'."
          return testResult
        }
      } else if (specialHandling === 'dateWithin1Sec') {
        const expectedDate = Date.parse(expectedValue)
        const actualDate = Date.parse(actualValue)

        const actualDatePlus1Second = (actualDate + 1000)
        const actualDateMinus1Second = (actualDate - 1000)

        if ( (expectedDate >= actualDateMinus1Second) && (expectedDate <= actualDatePlus1Second) ) {
          //PASS: expectedValue falls within actualValue +- 1 second
          testResult['passed'] = true
          testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' successfully fell within actualValue +- 1 second '" + actualValue + "'."
          return testResult
        } else {
          //FAIL: expectedValue did not fall within actualValue +- 1 second
          testResult['passed'] = false
          testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' did NOT fall within actualValue +- 1 second '" + actualValue + "'."
          return testResult
        }
      } else if (specialHandling === 'isArrayAndEmpty') {
        //expectedValue is not needed for this assertion check - ignore it

        if (actualValue !== null && actualValue.constructor === Array) {
          //Check that the type of actualValue is an array
          if (actualValue.length === 0) {
            //PASS: actualValue is empty array
            testResult['passed'] = true
            testResult['description'] =  specialHandling + ": Property '" + jsonPathToProperty + "' is an Array and is empty."
            return testResult
          } else {
            //FAIL: actualValue is not an empty array
            testResult['passed'] = false
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is an Array but is NOT empty, it contains '" + actualValue.length + "' items."
            return testResult
          }
        } else {
          //FAIL: actualValue is not an array
          testResult['passed'] = false
          testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is NOT an Array type, actualValue: '" + actualValue + "'."
          return testResult
        }
      } else if (specialHandling === 'isArrayAndNotEmpty') {
        //expectedValue is not needed for this assertion check - ignore it

        //Check that the type of actualValue is an array
        if (actualValue !== null && actualValue.constructor === Array) {
          if (actualValue.length === 0) {
            //FAIL: actualValue is an empty array
            testResult['passed'] = false
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is an Array but is empty."
            return testResult
          } else {
            //PASS: actualValue is an Array and NOT empty
            testResult['passed'] = true
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is an Array and is NOT empty, it contains '" + actualValue.length + "' items."
            return testResult
          }
        } else {
          //FAIL: actualValue is not an array
          testResult['passed'] = false
          testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is NOT an Array type, actualValue: '" + actualValue + "'."
          return testResult
        }
      }  else if (specialHandling === 'isArrayAndHasLength') {        
        var expectedArrayLength = expectedValue

        //Check that the type of actualValue is an array
        if (actualValue.constructor === Array) {
          if (actualValue.length === expectedArrayLength) {
            //PASS: actualValue is an Array and the actualValue length matches expectedArrayLength
            testResult['passed'] = true
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is an Array and the actual array length (" + actualValue.length + ") matches the expected array length (" + expectedArrayLength + ")."
            return testResult
          } else {
            //FAIL: actualValue length is not the same as expectedArrayLength
            testResult['passed'] = false
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is an Array but the actual array length (" + actualValue.length + ") DOES NOT match the expected array length (" + expectedArrayLength + ")."
            return testResult
          }
        } else {
          //FAIL: actualValue is not an array
          testResult['passed'] = false
          testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' is NOT an Array '" + actualValue + "'."
          return testResult
        }
      } else if (specialHandling === 'setAsEnvironmentVariable') {
        environmentVariableKey = expectedValue
        environmentVariableValue = actualValue

        pm.environment.set(environmentVariableKey, environmentVariableValue)

        testResult['passed'] = true
        testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' was set as an environment variable with key '" + environmentVariableKey + "' and value '" + environmentVariableValue + "'."
        return testResult
      } else if (specialHandling === 'setAsCollectionVariable') {
        collectionVariableKey = expectedValue
        collectionVariableValue = actualValue

        pm.collectionVariables.set(collectionVariableKey, collectionVariableValue)

        testResult['passed'] = true
        testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' was set as a variable with collectionVariableKey '" + collectionVariableKey + "' and collectionVariableValue '" + collectionVariableValue + "'."
        return testResult
      } else if (specialHandling === 'notThisExpectedValue') {
        if (regExpTrue === true) {
          //Compare using RegExp
          if (expectedValue.test(actualValue) !== true) {
            testResult['passed'] = true
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with RegExp expectedValue '" + expectedValue + "' CORRECTLY did NOT match actualValue '" + actualValue + "'."
            return testResult
          } else {
            testResult['passed'] = false
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with RegExp expectedValue '" + expectedValue + "' INCORRECTLY DID match actualValue '" + actualValue + "'."
            return testResult
          }
        } else {
          if (expectedValue !== actualValue) {
            testResult['passed'] = true
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' CORRECTLY did NOT match actualValue '" + actualValue + "'."
            return testResult
          } else {
            testResult['passed'] = false
            testResult['description'] = specialHandling + ": Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' INCORRECTLY DID match actualValue '" + actualValue + "'."
            return testResult
          }
        }
      } else {
        //FAIL: User error
        testResult['passed'] = false
        testResult['description'] = "Oops, function error: not a valid specialHandling value: " + specialHandling
        return testResult
      }
    } else {
      //Normal validation
      if (expectedValue !== undefined) {
        if (regExpTrue === true) {
          //Compare using RegExp
          if (expectedValue.test(actualValue) === true) {
            //PASS: expectedValue matched actualValue
            testResult['passed'] = true
            testResult['description'] = "Property '" + jsonPathToProperty + "' with RegExp expectedValue '" + expectedValue + "' matched actualValue '" + actualValue + "'."
            return testResult
          } else {
            //FAIL: expectedValue did not match actualValue
            testResult['passed'] = false
            testResult['description'] = "Property '" + jsonPathToProperty + "' with RegExp expectedValue '" + expectedValue + "' did NOT match actualValue '" + actualValue + "'."
            return testResult
          }
        } else {
          //Compare expectedValue with actualValue
          if (expectedValue === actualValue) {
            //PASS: expectedValue matched actualValue
            testResult['passed'] = true
            testResult['description'] = "Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' matched actualValue '" + actualValue + "'."
            return testResult
          } else {
            //FAIL: expectedValue did not match actualValue
            testResult['passed'] = false
            testResult['description'] = "Property '" + jsonPathToProperty + "' with expectedValue '" + expectedValue + "' did NOT match actualValue '" + actualValue + "'."
            return testResult
          }
        }
      } else {
        //PASS: No expectedValue - this is a pass
        testResult['passed'] = true
        testResult['description'] = "Found the property '" + jsonPathToProperty + "' in json response body (but not validating the value)."
        return testResult
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function getObjectValueByPath(object, path) {

    if (Array.isArray(path)) {
      return get(object, path, undefined)
    } else if (path === '') {
      //Return object as is
      return object
    } else {
      return path.split(".").reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x]
      }, object)
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //  Taken from: https://github.com/lodash/lodash/blob/master/get.js
  //////////////////////////////////////////////////////////////////////////////
  function get(object, path, defaultValue) {
    const result = object == null ? undefined : baseGet(object, path)
    return result === undefined ? defaultValue : result
  }


  //////////////////////////////////////////////////////////////////////////////
  //  Modified from https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
  //////////////////////////////////////////////////////////////////////////////
  function baseGet(object, path) {
    var index = 0
    const length = path.length

    while (object != null && index < length) {
      object = object[toKey(path[index++])]
    }

    return (index && index == length) ? object : undefined
  }


  //////////////////////////////////////////////////////////////////////////////
  //  Modified from https://github.com/lodash/lodash/blob/master/.internal/toKey.js
  //////////////////////////////////////////////////////////////////////////////
  function toKey(value) {

    if (typeof value === 'string') {
      return value
    }

    //const result = `${value}`
    const result = value.toString()
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function deleteObjectValueByPath(object, path) {

    //Only delete property if strictValidationEnabled
    if (strictValidationEnabled === true) {
      if (Array.isArray(path)) {
        deleteObjectValueByPathAsArray(object, path)
      } else {
        deleteObjectValueByPathAsArray(object, path.split("."))
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function deleteObjectValueByPathAsArray(object, pathAsArray) {
    pathAsArray.reduce(function(o, x) {
      if (typeof o == "undefined" || o === null) {
        return o
      } else {
        if (typeof o[x] === "object") {
          return o[x]
        } else {
          delete o[x]
        }
      }
    }, object)
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function cleanObject(object) {

    return function prune(current) {
      _.forOwn(current, function (value, key) {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) || (_.isString(value) && _.isEmpty(value)) || (_.isObject(value) && _.isEmpty(prune(value)))) {
          delete current[key];
        }
      })
      // Remove any leftover undefined values from the delete operation on an array
      if (_.isArray(current)) _.pull(current, undefined)
      return current
    }(object)

  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function cleanObjectExceptEmptyString(object) {

    return function prune(current) {
      _.forOwn(current, function (value, key) {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) || (_.isObject(value) && _.isEmpty(prune(value)))) {
          delete current[key];
        }
      })
      // Remove any leftover undefined values from the delete operation on an array
      if (_.isArray(current)) _.pull(current, undefined)
      return current
    }(object)

  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function removeAllXmlNameSpaceData(object) {
    var newKey = ''

    //Recursively remove all XML name space data
    traverseObject(object)

    function traverseObject(obj) {
      var isArray = obj instanceof Array

      Object.keys(obj).forEach(function(item) {
        if (typeof obj[item] === 'object' && obj[item] !== null) {
            if (isArray) {
              traverseObject(obj[item])
            } else {
              //Delete all objects with key '$'
              if (item === '$') {
                delete obj[item]
              } else {
                //Rename keys
                newKey = getXmlNameWithoutNamespace(item)

                //Only update if namespace exists
                if (newKey !== item) {
                  obj[newKey] = obj[item]
                  delete obj[item]
                }

                traverseObject(obj[newKey])
              }
            }
        } else {
          //Rename keys
          newKey = getXmlNameWithoutNamespace(item)

          //Only update if namespace exists
          if (newKey !== item) {
            obj[newKey] = obj[item]
            delete obj[item]
          }
        }
      })
    }

    function getXmlNameWithoutNamespace(xmlName) {
      var strPos1 = xmlName.indexOf(':')
      var newXmlName = xmlName

      if (strPos1 >= 0) {
        newXmlName = xmlName.substring(strPos1 + 1)
      }

      return newXmlName
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function isNotValidInteger(value) {
    if (/^(\+|\-)?(0|[1-9]\d*)$/.test(value)) {
      return false
    } else {
      return true
    }
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function getDateYMD(epochValue) {
    var d = new Date(epochValue)
    var year = d.getFullYear()
    var month = ("0" + (d.getMonth() + 1)).slice(-2)
    var day = ("0" + d.getDate()).slice(-2)

    return year + "-" + month + "-" + day
  }


  //////////////////////////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////////////////////////
  function strftimeModule() {
    //NOTE: Edit from original (module converted to local function)
    var self = this

    var DefaultLocale = {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        AM: 'AM',
        PM: 'PM',
        am: 'am',
        pm: 'pm',
        formats: {
            D: '%m/%d/%y',
            F: '%Y-%m-%d',
            R: '%H:%M',
            T: '%H:%M:%S',
            X: '%T',
            c: '%a %b %d %X %Y',
            r: '%I:%M:%S %p',
            v: '%e-%b-%Y',
            x: '%D'
        }
    },
    defaultStrftime = new Strftime(DefaultLocale, 0, false),
    isCommonJS = typeof module !== 'undefined',
    namespace;

    // CommonJS / Node module
    if (isCommonJS) {
        namespace = module.exports = adaptedStrftime;
        namespace.strftime = deprecatedStrftime;
    }
    // Browsers and other environments
    else {
        // Get the global object. Works in ES3, ES5, and ES5 strict mode.
        namespace = (function() { return this || (1,eval)('this'); }());
        namespace.strftime = adaptedStrftime;
    }

    // Deprecated API, to be removed in v1.0
    var _require = isCommonJS ? "require('strftime')" : "strftime";
    var _deprecationWarnings = {};
    function deprecationWarning(name, instead) {
        if (!_deprecationWarnings[name]) {
            if (typeof console !== 'undefined' && typeof console.warn == 'function') {
                console.warn("[WARNING] " + name + " is deprecated and will be removed in ver 1.0. Instead, use `" + instead + "`.");
            }
            _deprecationWarnings[name] = true;
        }
    }

    namespace.strftimeTZ = deprecatedStrftimeTZ;
    namespace.strftimeUTC = deprecatedStrftimeUTC;
    namespace.localizedStrftime = deprecatedStrftimeLocalized;

    // Adapt the old API while preserving the new API.
    function adaptForwards(fn) {
        fn.localize = defaultStrftime.localize.bind(defaultStrftime);
        fn.timezone = defaultStrftime.timezone.bind(defaultStrftime);
        fn.utc = defaultStrftime.utc.bind(defaultStrftime);
    }

    adaptForwards(adaptedStrftime);
    function adaptedStrftime(fmt, d, locale) {
        // d and locale are optional, check if this is (format, locale)
        if (d && d.days) {
            locale = d;
            d = undefined;
        }
        if (locale) {
            deprecationWarning("`" + _require + "(format, [date], [locale])`", "var s = " + _require + ".localize(locale); s(format, [date])");
        }
        var strftime = locale ? defaultStrftime.localize(locale) : defaultStrftime;
        return strftime(fmt, d);
    }

    //NOTE: Edit from original (module converted to local function)
    adaptForwards(self);
    function deprecatedStrftime(fmt, d, locale) {
        if (locale) {
            deprecationWarning("`" + _require + ".strftime(format, [date], [locale])`", "var s = " + _require + ".localize(locale); s(format, [date])");
        }
        else {
            deprecationWarning("`" + _require + ".strftime(format, [date])`", _require + "(format, [date])");
        }
        var strftime = locale ? defaultStrftime.localize(locale) : defaultStrftime;
        return strftime(fmt, d);
    }

    function deprecatedStrftimeTZ(fmt, d, locale, timezone) {
        // locale is optional, check if this is (format, date, timezone)
        if ((typeof locale == 'number' || typeof locale == 'string') && timezone == null) {
            timezone = locale;
            locale = undefined;
        }

        if (locale) {
            deprecationWarning("`" + _require + ".strftimeTZ(format, date, locale, tz)`", "var s = " + _require + ".localize(locale).timezone(tz); s(format, [date])` or `var s = " + _require + ".localize(locale); s.timezone(tz)(format, [date])");
        }
        else {
            deprecationWarning("`" + _require + ".strftimeTZ(format, date, tz)`", "var s = " + _require + ".timezone(tz); s(format, [date])` or `" + _require + ".timezone(tz)(format, [date])");
        }

        var strftime = (locale ? defaultStrftime.localize(locale) : defaultStrftime).timezone(timezone);
        return strftime(fmt, d);
    }

    var utcStrftime = defaultStrftime.utc();
    function deprecatedStrftimeUTC(fmt, d, locale) {
        if (locale) {
            deprecationWarning("`" + _require + ".strftimeUTC(format, date, locale)`", "var s = " + _require + ".localize(locale).utc(); s(format, [date])");
        }
        else {
            deprecationWarning("`" + _require + ".strftimeUTC(format, [date])`", "var s = " + _require + ".utc(); s(format, [date])");
        }
        var strftime = locale ? utcStrftime.localize(locale) : utcStrftime;
        return strftime(fmt, d);
    }

    function deprecatedStrftimeLocalized(locale) {
        deprecationWarning("`" + _require + ".localizedStrftime(locale)`", _require + ".localize(locale)");
        return defaultStrftime.localize(locale);
    }
    // End of deprecated API

    // Polyfill Date.now for old browsers.
    if (typeof Date.now !== 'function') {
        Date.now = function() {
          return +new Date();
        };
    }

    function Strftime(locale, customTimezoneOffset, useUtcTimezone) {
        var _locale = locale || DefaultLocale,
            _customTimezoneOffset = customTimezoneOffset || 0,
            _useUtcBasedDate = useUtcTimezone || false,

            // we store unix timestamp value here to not create new Date() each iteration (each millisecond)
            // Date.now() is 2 times faster than new Date()
            // while millisecond precise is enough here
            // this could be very helpful when strftime triggered a lot of times one by one
            _cachedDateTimestamp = 0,
            _cachedDate;

        function _strftime(format, date) {
            var timestamp;

            if (!date) {
                var currentTimestamp = Date.now();
                if (currentTimestamp > _cachedDateTimestamp) {
                    _cachedDateTimestamp = currentTimestamp;
                    _cachedDate = new Date(_cachedDateTimestamp);

                    timestamp = _cachedDateTimestamp;

                    if (_useUtcBasedDate) {
                        // how to avoid duplication of date instantiation for utc here?
                        // we tied to getTimezoneOffset of the current date
                        _cachedDate = new Date(_cachedDateTimestamp + getTimestampToUtcOffsetFor(_cachedDate) + _customTimezoneOffset);
                    }
                }
                else {
                  timestamp = _cachedDateTimestamp;
                }
                date = _cachedDate;
            }
            else {
                timestamp = date.getTime();

                if (_useUtcBasedDate) {
                    date = new Date(date.getTime() + getTimestampToUtcOffsetFor(date) + _customTimezoneOffset);
                }
            }

            return _processFormat(format, date, _locale, timestamp);
        }

        function _processFormat(format, date, locale, timestamp) {
            var resultString = '',
                padding = null,
                isInScope = false,
                length = format.length,
                extendedTZ = false;

            for (var i = 0; i < length; i++) {

                var currentCharCode = format.charCodeAt(i);

                if (isInScope === true) {
                    // '-'
                    if (currentCharCode === 45) {
                        padding = '';
                        continue;
                    }
                    // '_'
                    else if (currentCharCode === 95) {
                        padding = ' ';
                        continue;
                    }
                    // '0'
                    else if (currentCharCode === 48) {
                        padding = '0';
                        continue;
                    }
                    // ':'
                    else if (currentCharCode === 58) {
                      if (extendedTZ) {
                        if (typeof console !== 'undefined' && typeof console.warn == 'function') {
                          console.warn("[WARNING] detected use of unsupported %:: or %::: modifiers to strftime");
                        }
                      }
                      extendedTZ = true;
                      continue;
                    }

                    switch (currentCharCode) {

                        // Examples for new Date(0) in GMT

                        // 'Thursday'
                        // case 'A':
                        case 65:
                            resultString += locale.days[date.getDay()];
                            break;

                        // 'January'
                        // case 'B':
                        case 66:
                            resultString += locale.months[date.getMonth()];
                            break;

                        // '19'
                        // case 'C':
                        case 67:
                            resultString += padTill2(Math.floor(date.getFullYear() / 100), padding);
                            break;

                        // '01/01/70'
                        // case 'D':
                        case 68:
                            resultString += _processFormat(locale.formats.D, date, locale, timestamp);
                            break;

                        // '1970-01-01'
                        // case 'F':
                        case 70:
                            resultString += _processFormat(locale.formats.F, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'H':
                        case 72:
                            resultString += padTill2(date.getHours(), padding);
                            break;

                        // '12'
                        // case 'I':
                        case 73:
                            resultString += padTill2(hours12(date.getHours()), padding);
                            break;

                        // '000'
                        // case 'L':
                        case 76:
                            resultString += padTill3(Math.floor(timestamp % 1000));
                            break;

                        // '00'
                        // case 'M':
                        case 77:
                            resultString += padTill2(date.getMinutes(), padding);
                            break;

                        // 'am'
                        // case 'P':
                        case 80:
                            resultString += date.getHours() < 12 ? locale.am : locale.pm;
                            break;

                        // '00:00'
                        // case 'R':
                        case 82:
                            resultString += _processFormat(locale.formats.R, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'S':
                        case 83:
                            resultString += padTill2(date.getSeconds(), padding);
                            break;

                        // '00:00:00'
                        // case 'T':
                        case 84:
                            resultString += _processFormat(locale.formats.T, date, locale, timestamp);
                            break;

                        // '00'
                        // case 'U':
                        case 85:
                            resultString += padTill2(weekNumber(date, 'sunday'), padding);
                            break;

                        // '00'
                        // case 'W':
                        case 87:
                            resultString += padTill2(weekNumber(date, 'monday'), padding);
                            break;

                        // '16:00:00'
                        // case 'X':
                        case 88:
                            resultString += _processFormat(locale.formats.X, date, locale, timestamp);
                            break;

                        // '1970'
                        // case 'Y':
                        case 89:
                            resultString += date.getFullYear();
                            break;

                        // 'GMT'
                        // case 'Z':
                        case 90:
                            if (_useUtcBasedDate && _customTimezoneOffset === 0) {
                                resultString += "GMT";
                            }
                            else {
                                // fixme optimize
                                var tzString = date.toString().match(/\(([\w\s]+)\)/);
                                resultString += tzString && tzString[1] || '';
                            }
                            break;

                        // 'Thu'
                        // case 'a':
                        case 97:
                            resultString += locale.shortDays[date.getDay()];
                            break;

                        // 'Jan'
                        // case 'b':
                        case 98:
                            resultString += locale.shortMonths[date.getMonth()];
                            break;

                        // ''
                        // case 'c':
                        case 99:
                            resultString += _processFormat(locale.formats.c, date, locale, timestamp);
                            break;

                        // '01'
                        // case 'd':
                        case 100:
                            resultString += padTill2(date.getDate(), padding);
                            break;

                        // ' 1'
                        // case 'e':
                        case 101:
                            resultString += padTill2(date.getDate(), padding == null ? ' ' : padding);
                            break;

                        // 'Jan'
                        // case 'h':
                        case 104:
                            resultString += locale.shortMonths[date.getMonth()];
                            break;

                        // '000'
                        // case 'j':
                        case 106:
                            var y = new Date(date.getFullYear(), 0, 1);
                            var day = Math.ceil((date.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
                            resultString += padTill3(day);
                            break;

                        // ' 0'
                        // case 'k':
                        case 107:
                            resultString += padTill2(date.getHours(), padding == null ? ' ' : padding);
                            break;

                        // '12'
                        // case 'l':
                        case 108:
                            resultString += padTill2(hours12(date.getHours()), padding == null ? ' ' : padding);
                            break;

                        // '01'
                        // case 'm':
                        case 109:
                            resultString += padTill2(date.getMonth() + 1, padding);
                            break;

                        // '\n'
                        // case 'n':
                        case 110:
                            resultString += '\n';
                            break;

                        // '1st'
                        // case 'o':
                        case 111:
                            resultString += String(date.getDate()) + ordinal(date.getDate());
                            break;

                        // 'AM'
                        // case 'p':
                        case 112:
                            resultString += date.getHours() < 12 ? locale.AM : locale.PM;
                            break;

                        // '12:00:00 AM'
                        // case 'r':
                        case 114:
                            resultString += _processFormat(locale.formats.r, date, locale, timestamp);
                            break;

                        // '0'
                        // case 's':
                        case 115:
                            resultString += Math.floor(timestamp / 1000);
                            break;

                        // '\t'
                        // case 't':
                        case 116:
                            resultString += '\t';
                            break;

                        // '4'
                        // case 'u':
                        case 117:
                            var day = date.getDay();
                            resultString += day === 0 ? 7 : day;
                            break; // 1 - 7, Monday is first day of the week

                        // ' 1-Jan-1970'
                        // case 'v':
                        case 118:
                            resultString += _processFormat(locale.formats.v, date, locale, timestamp);
                            break;

                        // '4'
                        // case 'w':
                        case 119:
                            resultString += date.getDay();
                            break; // 0 - 6, Sunday is first day of the week

                        // '12/31/69'
                        // case 'x':
                        case 120:
                            resultString += _processFormat(locale.formats.x, date, locale, timestamp);
                            break;

                        // '70'
                        // case 'y':
                        case 121:
                            resultString += ('' + date.getFullYear()).slice(2);
                            break;

                        // '+0000'
                        // case 'z':
                        case 122:
                            if (_useUtcBasedDate && _customTimezoneOffset === 0) {
                                resultString += extendedTZ ? "+00:00" : "+0000";
                            }
                            else {
                                var off;
                                if (_customTimezoneOffset !== 0) {
                                    off = _customTimezoneOffset / (60 * 1000);
                                }
                                else {
                                    off = -date.getTimezoneOffset();
                                }
                                var sign = off < 0 ? '-' : '+';
                                var sep = extendedTZ ? ':' : '';
                                var hours = Math.floor(Math.abs(off / 60));
                                var mins = Math.abs(off % 60);
                                resultString += sign + padTill2(hours) + sep + padTill2(mins);
                            }
                            break;

                        default:
                            resultString += format[i];
                            break;
                    }

                    padding = null;
                    isInScope = false;
                    continue;
                }

                // '%'
                if (currentCharCode === 37) {
                    isInScope = true;
                    continue;
                }

                resultString += format[i];
            }

            return resultString;
        }

        var strftime = _strftime;

        strftime.localize = function(locale) {
            return new Strftime(locale || _locale, _customTimezoneOffset, _useUtcBasedDate);
        };

        strftime.timezone = function(timezone) {
            var customTimezoneOffset = _customTimezoneOffset;
            var useUtcBasedDate = _useUtcBasedDate;

            var timezoneType = typeof timezone;
            if (timezoneType === 'number' || timezoneType === 'string') {
                useUtcBasedDate = true;

                // ISO 8601 format timezone string, [-+]HHMM
                if (timezoneType === 'string') {
                    var sign = timezone[0] === '-' ? -1 : 1,
                        hours = parseInt(timezone.slice(1, 3), 10),
                        minutes = parseInt(timezone.slice(3, 5), 10);

                    customTimezoneOffset = sign * ((60 * hours) + minutes) * 60 * 1000;
                    // in minutes: 420
                }
                else if (timezoneType === 'number') {
                    customTimezoneOffset = timezone * 60 * 1000;
                }
            }

            return new Strftime(_locale, customTimezoneOffset, useUtcBasedDate);
        };

        strftime.utc = function() {
            return new Strftime(_locale, _customTimezoneOffset, true);
        };

        return strftime;
    }

    function padTill2(numberToPad, paddingChar) {
        if (paddingChar === '' || numberToPad > 9) {
            return numberToPad;
        }
        if (paddingChar == null) {
            paddingChar = '0';
        }
        return paddingChar + numberToPad;
    }

    function padTill3(numberToPad) {
        if (numberToPad > 99) {
            return numberToPad;
        }
        if (numberToPad > 9) {
            return '0' + numberToPad;
        }
        return '00' + numberToPad;
    }

    function hours12(hour) {
        if (hour === 0) {
            return 12;
        }
        else if (hour > 12) {
            return hour - 12;
        }
        return hour;
    }

    // firstWeekday: 'sunday' or 'monday', default is 'sunday'
    //
    // Pilfered & ported from Ruby's strftime implementation.
    function weekNumber(date, firstWeekday) {
        firstWeekday = firstWeekday || 'sunday';

        // This works by shifting the weekday back by one day if we
        // are treating Monday as the first day of the week.
        var weekday = date.getDay();
        if (firstWeekday === 'monday') {
            if (weekday === 0) // Sunday
                weekday = 6;
            else
                weekday--;
        }

        var firstDayOfYearUtc = Date.UTC(date.getFullYear(), 0, 1),
            dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            yday = Math.floor((dateUtc - firstDayOfYearUtc) / 86400000),
            weekNum = (yday + 7 - weekday) / 7;

        return Math.floor(weekNum);
    }

    // Get the ordinal suffix for a number: st, nd, rd, or th
    function ordinal(number) {
        var i = number % 10;
        var ii = number % 100;

        if ((ii >= 11 && ii <= 13) || i === 0 || i >= 4) {
            return 'th';
        }
        switch (i) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
        }
    }

    function getTimestampToUtcOffsetFor(date) {
        return (date.getTimezoneOffset() || 0) * 60000;
    }
  }
}
xtest()
//module.exports = xtest
