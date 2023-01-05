![Postman Image](https://assets.getpostman.com/common-share/postman-logo-horizontal-320x132.png)


## Table of Contents
- [Overview](#overview)
- [Supported Content Types](#supported-content-types)
- [How To Install xtest Within Postman Desktop App](#how-to-install-xtest-within-postman-desktop-app)
- [Available Functions](#available-functions)
  1. [startXTest()](#startXTest)
  2. [expectResponseStatusCodeToBe()](#expectResponseStatusCodeToBe)
  3. [expectResponseToHaveHeader()](#expectResponseToHaveHeader)
  4. [expectResponseBodyToHaveProperty()](#expectResponseBodyToHaveProperty)
  5. [expectResponseBodyToHaveUnorderedArray()](#expectResponseBodyToHaveUnorderedArray)
  6. [endXTest()](#endXTest)
  7. [date()](#date)
- [XML Support](#xml-support)

<br/>

# xtest - Postman Extended Test

## Overview
Postman extended test (xtest) is a module that can be used within Postman/Newman to test your APIs with speed, simplicity, and at scale. **There is no need to write any code**; just use the simple, yet powerful, functions provided. And as a bonus, your team/organization will be able to quickly and effortlessly understand tests across all projects, no matter who creates them.

<br/>

## Supported Content Types
* JSON
* XML (internally converted to JSON)

<br/>

## How To Install xtest Within Postman Desktop App
1. Copy the latest minified code (click the "Copy source to clipboard" button): https://github.com/schwabyio/xtest/blob/master/xtest.min.js
2. Paste this code as a Postman global variable with key ```xtest```: Postman App -> Environment -> Globals -> Edit
3. Create another Postman global variable (same as step 2) with key ```useStrictValidation``` and a boolean value of ```true```.

<br/>

## Available Functions

<br/>

<div id='startXTest'/>

# startXTest()

This function is used once at the beginning of each test to initialize xtest.
<details>
  <summary>Click for details.</summary>

```js
startXTest(pm, pm.globals.get("useStrictValidation"));
```
or hardcode ```useStrictValidation``` to false
```js
startXTest(pm, false);
```

```
Inputs:
pm: [Object] - postman object.

useStrictValidation: [Boolean] - When useStrictValidation is set to true, you will need an assertion for every response body property. If any response body properties do not contain an assertion the test will fail notifying there are response properties that are not validated. Hardcode useStrictValidation to false if you do not want to validate all response body properties for a particular test.

Output:
undefined
```

</details>
<br/><br/>


<div id='expectResponseStatusCodeToBe'/>

# expectResponseStatusCodeToBe()

This function is used to validate the response http status code.
<br/>
<br/>

**Function Type 1: ```expectResponseStatusCodeToBe(expectedValue [Number])```**
<br/>
Validate response status code as number.
<details>
  <summary>Click for details.</summary>

```js
expectResponseStatusCodeToBe(expectedValue);
```

```
Inputs:
expectedValue: [Number] - set with the expected response status code value (e.g. 200).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-ffe6a29c-ba8b-4443-bbc0-a11b57eebcb6?action=collection%2Ffork&collection-url=entityId%3D24782047-ffe6a29c-ba8b-4443-bbc0-a11b57eebcb6%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 2: ```expectResponseStatusCodeToBe(expectedValue [Number], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate response status code is NOT a given number.
<details>
  <summary>Click for details.</summary>

```js
expectResponseStatusCodeToBe(expectedValue, "notThisExpectedValue");
```

```
Inputs:
expectedValue: [Number] - set with the expected response status code value (e.g. 200).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-dd6d0de0-ab70-4595-bccc-70da75555ec6?action=collection%2Ffork&collection-url=entityId%3D24782047-dd6d0de0-ab70-4595-bccc-70da75555ec6%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 3: ```expectResponseStatusCodeToBe(expectedValue [RegExp])```**
<br/>
Validate response status code as regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseStatusCodeToBe(expectedValue);
```

```
Inputs:
expectedValue: [RegExp] - set with a regular expression to test against the expected response status code (e.g. /^2/).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-e44010e6-ce19-4eb5-9b00-2aa5c24eda99?action=collection%2Ffork&collection-url=entityId%3D24782047-e44010e6-ce19-4eb5-9b00-2aa5c24eda99%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>



**Function Type 4: ```expectResponseStatusCodeToBe(expectedValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate response status code is NOT a given regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseStatusCodeToBe(expectedValue);
```

```
Inputs:
expectedValue: [RegExp] - set with a regular expression to test against the expected response status code (e.g. /^2/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-05f577cf-a05d-48e3-9d97-c5fbb67c4c0e?action=collection%2Ffork&collection-url=entityId%3D24782047-05f577cf-a05d-48e3-9d97-c5fbb67c4c0e%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 5: ```expectResponseStatusCodeToBe(collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br/>
Set the response status code as an collection variable.
<details>
  <summary>Click for details.</summary>

```js
expectResponseStatusCodeToBe(collectionVariableKey, "setAsCollectionVariable");
```

```
Inputs:
collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-eb7f36f3-9a37-48c1-9912-75757863def2?action=collection%2Ffork&collection-url=entityId%3D24782047-eb7f36f3-9a37-48c1-9912-75757863def2%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


<div id='expectResponseToHaveHeader'/>

# expectResponseToHaveHeader()

This function is used to validate the response http headers.
<br/>
<br/>

**Function Type 1: ```expectResponseToHaveHeader(expectedHeaderKey [String])```**
<br/>
Validate response header key exists. Ignore response header value.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey);
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-54d22ee9-8938-4c3d-866d-ad783545d6fd?action=collection%2Ffork&collection-url=entityId%3D24782047-54d22ee9-8938-4c3d-866d-ad783545d6fd%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 2: ```expectResponseToHaveHeader(expectedHeaderKey [String], null, specialHandling [String] = "notThisExpectedKey")```**
<br/>
Validate a response header key does NOT exist.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, null, "notThisExpectedKey");
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

null - set 2nd parameter to null.

specialHandling: [String] -  set with value "notThisExpectedKey".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-e5c7f24e-4ffc-4d09-81ad-c580a14fda56?action=collection%2Ffork&collection-url=entityId%3D24782047-e5c7f24e-4ffc-4d09-81ad-c580a14fda56%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 3: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [String])```**
<br/>
Validate response header key and header value as strings.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue);
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [String] -  set with the expected response header value.

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-8d017b5d-4681-47ac-84bd-8c043fb4676c?action=collection%2Ffork&collection-url=entityId%3D24782047-8d017b5d-4681-47ac-84bd-8c043fb4676c%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 4: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [String], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate for a given response header key that the header value does NOT match.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue, "notThisExpectedValue");
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [String] -  set with the expected response header value.

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-eea3a589-d93f-4609-a9c6-6a195c2736e7?action=collection%2Ffork&collection-url=entityId%3D24782047-eea3a589-d93f-4609-a9c6-6a195c2736e7%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 5: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [RegExp])```**
<br/>
Validate response header key as string. Validate response header value as regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue);
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [RegExp] -  set with a regular expression to test against the expected response header value (e.g. /someregularexpression/).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-3074a454-d810-4fe9-a6d7-bfa4f4fc0a99?action=collection%2Ffork&collection-url=entityId%3D24782047-3074a454-d810-4fe9-a6d7-bfa4f4fc0a99%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 6: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate response header key as string. Validate response header value does NOT match regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue, "notThisExpectedValue);
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [RegExp] -  set with a regular expression to test against the expected response header value (e.g. /someregularexpression/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-6d8ec1f6-a7ec-4716-839a-9b0862af2ced?action=collection%2Ffork&collection-url=entityId%3D24782047-6d8ec1f6-a7ec-4716-839a-9b0862af2ced%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 7: ```expectResponseToHaveHeader(expectedHeaderKey [String], collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br/>
Set a response header value as an collection variable.
<details>
  <summary>Click for details.</summary>

```js
expectResponseToHaveHeader(expectedHeaderKey, collectionVariableKey, "setAsCollectionVariable");
```

```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-8efd6c98-4b13-4de9-9da3-fa2d9f7824b7?action=collection%2Ffork&collection-url=entityId%3D24782047-8efd6c98-4b13-4de9-9da3-fa2d9f7824b7%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


<div id='expectResponseBodyToHaveProperty'/>

# expectResponseBodyToHaveProperty()

This function is used to validate a response body property (xml is internally converted to json).
<br/>
<br/>


**Function Type 1: ```expectResponseBodyToHaveProperty(jsonPath [String])```**
<br/>
Validate property exists. Ignore property value.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath);
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-c3973801-d149-4f35-b290-e526873d5852?action=collection%2Ffork&collection-url=entityId%3D24782047-c3973801-d149-4f35-b290-e526873d5852%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 2: ```expectResponseBodyToHaveProperty(jsonPath [String], null, specialHandling [String] = "notThisExpectedKey")```**
<br/>
Validate response body property does NOT exist (In this context, notThisExpectedKey is the jsonPath).
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, null, "notThisExpectedKey");
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

null - set 2nd parameter to null.

specialHandling: [String] -  set with value "notThisExpectedKey".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-3a10308c-b03a-4fa9-ac8b-8c461892c2e8?action=collection%2Ffork&collection-url=entityId%3D24782047-3a10308c-b03a-4fa9-ac8b-8c461892c2e8%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 3: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String, Boolean, Number, or null])```**
<br/>
Validate response body property exists with expected value and expected data type.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue);
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [String, Boolean, Number, or null] - set with the expected property value. Note: data type is also validated (i.e. String, Boolean, Number, or null).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-a379078a-6534-4dcf-9901-a7e813b461eb?action=collection%2Ffork&collection-url=entityId%3D24782047-a379078a-6534-4dcf-9901-a7e813b461eb%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 4: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String, Boolean, Number, or null], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate response body property exists but NOT with a given value.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "notThisExpectedValue");
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [String, Boolean, Number, or null] - set with the expected property value. Note: data type is also validated (i.e. String, Boolean, Number, or null).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-ac989273-da1e-44ce-a128-7ffeab851372?action=collection%2Ffork&collection-url=entityId%3D24782047-ac989273-da1e-44ce-a128-7ffeab851372%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 5: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [RegExp])```**
<br/>
Validate response body property exists with value matched against a regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue);
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [RegExp] - set with a regular expression to test against the expected json response property value (e.g. /someregularexpression/).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-2e5b28a4-ac5a-4822-aea1-ddcc1e351601?action=collection%2Ffork&collection-url=entityId%3D24782047-2e5b28a4-ac5a-4822-aea1-ddcc1e351601%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 6: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br/>
Validate response body property exists but does NOT match against a regular expression.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "notThisExpectedValue");
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [RegExp] - set with a regular expression to test against the expected json response property value (e.g. /someregularexpression/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-b3a4d3ef-3129-4057-b3aa-b9b6dceaa0ca?action=collection%2Ffork&collection-url=entityId%3D24782047-b3a4d3ef-3129-4057-b3aa-b9b6dceaa0ca%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 7: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [Number], specialHandling [String] = "dateAsEpoch")```**
<br/>
Validate response body property exists with expectedValue as +-secondsOffset and specialHandling dateAsEpoch.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "dateAsEpoch");
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "nextPaymentDate").

expectedValue: [Number] - set with +-secondsOffset from now (e.g. -86400 will yesterday, 86400 will be tomorrow, 604800 will be 7 days from today).

specialHandling: [String] - set with "dateAsEpoch" will internally validate the expectedValue +-secondsOffset as an internally normalized date compared to the
actualValue epoch response also as an internally normalized date.

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-aec67abe-44ac-474b-a9df-bfb15808b802?action=collection%2Ffork&collection-url=entityId%3D24782047-aec67abe-44ac-474b-a9df-bfb15808b802%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 8: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String], specialHandling [String] = "dateAsEpoch")```**
<br/>
Validate response body property exists with expectedValue in string format "YYYY-MM-DD" and specialHandling dateAsEpoch.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "dateAsEpoch");
```

```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "nextPaymentDate").

expectedValue: [String] - set with hard coded date in format "YYYY-MM-DD" (only first 10 chars of string are used) (e.g. "2012-10-31", "2012-10-31-07:00").

specialHandling: [String] - set with "dateAsEpoch" will internally validate the expectedValue hard coded date in format "YYYY-MM-DD" compared to the actualValue epoch response as an internally normalized date.

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-d96f8a86-8af2-4349-bd60-7997b0cfe74e?action=collection%2Ffork&collection-url=entityId%3D24782047-d96f8a86-8af2-4349-bd60-7997b0cfe74e%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 9: ```expectResponseBodyToHaveProperty(jsonPath [String], collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br/>
Set a response body property as an collection variable.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveProperty(jsonPath, collectionVariableKey, "setAsCollectionVariable");
```

```
Inputs:
jsonPath: [String] - set with the expected json path.

collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-48160916-02f6-4400-b0c9-d4a9b60dd32b?action=collection%2Ffork&collection-url=entityId%3D24782047-48160916-02f6-4400-b0c9-d4a9b60dd32b%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


<div id='expectResponseBodyToHaveUnorderedArray'/>

# expectResponseBodyToHaveUnorderedArray()

This function is used to validate a response body json array that does not have a sorted or consistent order.
<br/>
<br/>


**Function Type 1: ```expectResponseBodyToHaveUnorderedArray(jsonPathToArray [String], validationList [Simple Array])```**
<br/>
Validate a response body with an unordered array that is of simple type (i.e. simple list of items).
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveUnorderedArray(jsonPathToArray, validationList);
```

```
Inputs:
jsonPathToArray: [String] - set with the json path to the unordered array (e.g. "items.numeric").

validationList: [Simple Array] - set with the list of expected items from the json simple array (e.g. [5, 4, 2, 3, 1]).

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-af604e6b-e403-4814-906c-fc5efaa3b71c?action=collection%2Ffork&collection-url=entityId%3D24782047-af604e6b-e403-4814-906c-fc5efaa3b71c%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


**Function Type 2: ```expectResponseBodyToHaveUnorderedArray(jsonPathToArray [String], validationList [Array of Objects])```**
<br/>
Validate a response body with an unordered array of objects.
<details>
  <summary>Click for details.</summary>

```js
expectResponseBodyToHaveUnorderedArray(jsonPathToArray, validationList);
```

```
Inputs:
jsonPathToArray: [String] - set with the json path to the unordered array (e.g. "account").

validationList: [Array of Objects] - set with a list of objects with the following properties to validate against the json unordered array of objects:
  pathToProperty: [String] - set with the json path to the property relative to the 'jsonPathToArray'.

  expectedValue: [String, Boolean, Number, or null] - set with the expected property value. Note: data type is also validated (i.e. String, Boolean, Number, or null).

  specialHandling: [String] Optional - supported values: "dateAsEpoch", "setAsCollectionVariable", "notThisExpectedKey", "notThisExpectedValue", undefined. (NOTE: In this context, notThisExpectedKey is the pathToProperty)

Output:
undefined
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-e0f21352-d09e-492f-8005-7e198463fa80?action=collection%2Ffork&collection-url=entityId%3D24782047-e0f21352-d09e-492f-8005-7e198463fa80%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3) Example 1

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-c2dfb1bc-beeb-46db-824e-bf61caafadf5?action=collection%2Ffork&collection-url=entityId%3D24782047-c2dfb1bc-beeb-46db-824e-bf61caafadf5%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3) Example 2 (includes specialHandling: "setAsCollectionVariable")

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-449c5909-cdcc-49e9-be3c-45f39d51cf44?action=collection%2Ffork&collection-url=entityId%3D24782047-449c5909-cdcc-49e9-be3c-45f39d51cf44%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3) Example 3 (includes specialHandling: "notThisExpectedKey" and "notThisExpectedValue"):

</details>
<br/><br/>


<div id='endXTest'/>

# endXTest()

This function is used once at the end of each test to finalize xtest.
<details>
  <summary>Click for details.</summary>

```js
endXTest();
```

```
Inputs:
none

Output:
undefined
```

</details>
<br/><br/>


<div id='date'/>

# date()

This function can be used to dynamically generate a date/time value in any required format. [See here for supported dateFormat specifiers.](https://github.com/samsonjs/strftime/blob/master/Readme.md#supported-specifiers)
<details>
  <summary>Click for details.</summary>

```js
date(dateFormat, secondsOffset, timeZoneScheme);
```

```
Inputs:
dateFormat: [String] - set with the desired date/time format (e.g. "%Y-%m-%d") - see above link for all valid specifiers.

secondsOffset: [Number format: +-offsetInSeconds] - set with the number of seconds offset that you want the date/time generated for (e.g. -86400 is yesterday +604800 is 7 days from today).

timeZoneScheme: [String] set to one of the below valid time zone scheme values:

"A"   -> "+0100"
"B"   -> "+0200"  //e.g. EET - Eastern European Time
"C"   -> "+0300"  //e.g. EEDT - Eastern European Daylight Time
"D"   -> "+0400
""E"  -> "+0500"
"IST" -> "+0530"  //IST Indian Standard Time (added due to support IST 30 minute offset time)
"F"   -> "+0600"
"G"   -> "+0700"
"H"   -> "+0800"  //e.g. AWST - Australian Western Standard Time
"I"   -> "+0900"  //e.g. AWDT - Australian Western Daylight Time
"K"   -> "+1000"  //e.g. AEST - Australian Eastern Standard Time
"L"   -> "+1100"  //e.g. AEDT - Australian Eastern Daylight Savings Time
"M"   -> "+1200"  //e.g. NZST - New Zealand Standard Time
"N"   -> "-0100"
"O"   -> "-0200"
"P"   -> "-0300"
"Q"   -> "-0400"  //e.g. EDT - Eastern Daylight Time (North America)
"R"   -> "-0500"  //e.g. CDT - Central Daylight Time (North America)
"S"   -> "-0600"  //e.g. CST - Central Standard Time (North America)
"T"   -> "-0700"  //e.g. PDT - Pacific Daylight Time (North America)
"U"   -> "-0800"  //e.g. PST - Pacific Standard Time (North America)
"V"   -> "-0900"  //e.g. HADT - Hawaii-Aleutian Daylight Time
"W"   -> "-1000"  //e.g. HST - Hawaii Standard Time
"X"   -> "-1100"
"Y"   -> "-1200"
"Z"   -> "+0000"  //e.g. GMT - Greenwich Mean Time

Output:
formatted date [String or Number]
```

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-0c70a9e3-a6bb-49ed-91d9-f72aad624ae7?action=collection%2Ffork&collection-url=entityId%3D24782047-0c70a9e3-a6bb-49ed-91d9-f72aad624ae7%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3)

</details>
<br/><br/>


## XML Support
XML responses are internally converted into JSON and can be used with any of the xtest functions.
<details>
  <summary>Click for examples.</summary>

**Try it out in Postman:**
<br/>

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-66e7a6e2-51c0-4689-8887-58553e99705b?action=collection%2Ffork&collection-url=entityId%3D24782047-66e7a6e2-51c0-4689-8887-58553e99705b%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3) XML Response Example 1

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24782047-75f62bd3-2b30-4af0-a597-f4d4fb7335a5?action=collection%2Ffork&collection-url=entityId%3D24782047-75f62bd3-2b30-4af0-a597-f4d4fb7335a5%26entityType%3Dcollection%26workspaceId%3Dcb109feb-f5d7-4c98-b535-cbb21ddb7db3) XML Response Example 2

</details>
