![xtest Image](./resources/images/xtest-logo-500.png)
<!-- ![Postman Image](https://assets.getpostman.com/common-share/postman-logo-horizontal-320x132.png) -->


## Table of Contents
- [Overview](#overview)
  - [Strict Validation Support](#strict-validation-support)
  - [Supported Content Types](#supported-content-types)
- [How To Install xtest Within Postman Desktop App](#how-to-install-xtest-within-postman-desktop-app)
- [Demo With Live Working Examples](#demo-with-live-working-examples)
- [Format of xtest Postman Test](#format-of-xtest-postman-test)
  - [Sections](#sections)
- [xtest Assertion Functions](#xtest-assertion-functions)
  1. [expectResponseStatusCodeToBe()](#expectResponseStatusCodeToBe)
  2. [expectResponseToHaveHeader()](#expectResponseToHaveHeader)
  3. [expectResponseBodyToHaveProperty()](#expectResponseBodyToHaveProperty)
  4. [expectResponseBodyToHaveUnorderedArray()](#expectResponseBodyToHaveUnorderedArray)
  - [Special Handling](#special-handling)
- [Helper Functions](#helper-functions)
  1. [date()](#date)

# xtest - Postman Extended Test

## Overview
Postman extended test (xtest) is a module that is used within [Postman](https://www.postman.com/downloads/)/[xrun](https://github.com/schwabyio/xrun) to test your APIs with speed, simplicity, and at scale. **There is no need to write any code**; just use the simple, yet powerful, functions provided. And as a bonus, your team will be able to quickly and effortlessly understand tests across all projects, no matter who creates them.

### Strict Validation Support
A key feature of xtest is the idea of strict validation. When strict validation is enabled on a test it requires every response body property to be asserted on otherwise the test will fail. Use this for your mission critical APIs to provide even greater confidence in your API release cycle.


### Supported Content Types
| Name         | HTTP Content-Type     | Note                                                             | Live Example Demo               |
|--------------|-----------------------|------------------------------------------------------------------|---------------------------------|
| JSON         | application/json      |                                                                  | [See here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_VALUE.postman_collection.json)                    |
| XML          | application/xml       | Internally xml is converted to json object using xml2js.         | [See here](./tests/postman/demo/XTEST_DEMO_XML1.postman_collection.json)                    |
| Plain Text   | text/plain            | Internally plain text is set to json `plaintext` property.       | [See here](./tests/postman/demo/XTEST_DEMO_PLAIN_TEXT.postman_collection.json)                    |

<br>

## How To Install xtest Within Postman Desktop App
Open your Postman App and create the following two global variables (Postman App -> Environment -> Globals -> Add/Edit):
1. VARIABLE name of ```useStrictValidation``` with a CURRENT VALUE of ```true```.
2. VARIABLE name of ```xtest``` with a CURRENT VALUE using the latest xtest minified code (click the "Copy source to clipboard" button) located here: https://github.com/schwabyio/xtest/blob/master/xtest.min.js

* NOTE: If you still need help, [check out this video](https://user-images.githubusercontent.com/118861343/214447365-577cf802-2c28-4632-8964-5fca068d128f.mp4)

<br>

## Demo With Live Working Examples

There are a number of live working examples of each supported xtest function below that can be imported into your Postman Desktop app - [take a look and import them here!](./tests/postman/demo)

<br>

## Format of xtest Postman Test
All xtest assertions are done within the Postman `Scripts -> Post-response` section. The format will always have the following 4 sections:
```js
//1. Load xtest
var xtest = eval(pm.globals.get("xtest"));

//2. Start testing using xtest
startXTest(pm [Postman Object], useStrictValidation [Boolean]);

//////////////////////////////////////////////////////////////
//3. Set one or more xtest assertion functions in this section
//////////////////////////////////////////////////////////////

//4. End testing using xtest
endXTest();
```
### Sections
1. `Load xtest` - Always set exactly as is.
    * `var xtest = eval(pm.globals.get("xtest"));`
2. `Start testing using xtest`
    * `startXTest(pm [Postman Object], useStrictValidation [Boolean]);`
      * Always set 1st parameter with `pm` (Postman Object).
      * 2nd parameter is the `useStrictValidation` of type `Boolean`. Hard-code to `false` if you don't want to use strict validation in test. Otherwise, you can hard-code to `true`, but it's **instead reccomended to use the global variable `pm.globals.get("useStrictValidation")` to control**.
3. `Set one or more xtest assertion functions in this section`
4. `End testing using xtest` - Always set exactly as is (no parameters).
    * `endXTest();`

<br>

## xtest Assertion Functions

<br>

<div id='expectResponseStatusCodeToBe'/>

# expectResponseStatusCodeToBe()

This function is used to validate the response http status code.
<br>
<br>

**Function Type 1: ```expectResponseStatusCodeToBe(expectedValue [Number])```**
<br>
Validate response status code as number.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseStatusCodeToBe(expectedValue);
```

Function Details:
```
Inputs:
expectedValue: [Number] - set with the expected response status code value (e.g. 200).

Output:
undefined
```

Example:
```js
expectResponseStatusCodeToBe(200);
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_STATUS_CODE_TO_BE_NUMBER.postman_collection.json).

</details>
<br><br>


**Function Type 2: ```expectResponseStatusCodeToBe(expectedValue [Number], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate response status code is NOT a given number.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseStatusCodeToBe(expectedValue, "notThisExpectedValue");
```

Function Details:
```
Inputs:
expectedValue: [Number] - set with the expected response status code value (e.g. 200).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseStatusCodeToBe(200, "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_STATUS_CODE_TO_NOT_BE_THIS_NUMBER.postman_collection.json).

</details>
<br><br>


**Function Type 3: ```expectResponseStatusCodeToBe(expectedValue [RegExp])```**
<br>
Validate response status code as regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseStatusCodeToBe(expectedValue);
```

Function Details:
```
Inputs:
expectedValue: [RegExp] - set with a regular expression to test against the expected response status code (e.g. /^2/).

Output:
undefined
```

Example:
```js
expectResponseStatusCodeToBe(/^2/);
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_STATUS_CODE_TO_BE_REGEXP.postman_collection.json).

</details>
<br><br>



**Function Type 4: ```expectResponseStatusCodeToBe(expectedValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate response status code is NOT a given regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseStatusCodeToBe(expectedValue, "notThisExpectedValue");
```

Function Details:
```
Inputs:
expectedValue: [RegExp] - set with a regular expression to test against the expected response status code (e.g. /^2/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseStatusCodeToBe(/^4/, "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_STATUS_CODE_TO_NOT_BE_THIS_REGEXP.postman_collection.json).

</details>
<br><br>


**Function Type 5: ```expectResponseStatusCodeToBe(collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br>
Set the response status code as an collection variable.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseStatusCodeToBe(collectionVariableKey, "setAsCollectionVariable");
```

Function Details:
```
Inputs:
collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

Example:
```js
expectResponseStatusCodeToBe("responseCodeKey", "setAsCollectionVariable");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_STATUS_CODE_SPECIAL_HANDLING_SET_AS_COLLECTION_VARIABLE.postman_collection.json).

</details>
<br><br>


<div id='expectResponseToHaveHeader'/>

# expectResponseToHaveHeader()

This function is used to validate the response http headers.
<br>
<br>

**Function Type 1: ```expectResponseToHaveHeader(expectedHeaderKey [String])```**
<br>
Validate response header key exists. Ignore response header value.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey);
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_HAVE_HEADER_IGNORE_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 2: ```expectResponseToHaveHeader(expectedHeaderKey [String], null, specialHandling [String] = "notThisExpectedKey")```**
<br>
Validate a response header key does NOT exist.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, null, "notThisExpectedKey");
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

null - set 2nd parameter to null.

specialHandling: [String] -  set with value "notThisExpectedKey".

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("some-header", null, "notThisExpectedKey");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_NOT_HAVE_HEADER.postman_collection.json).

</details>
<br><br>


**Function Type 3: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [String])```**
<br>
Validate response header key and header value as strings.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue);
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [String] -  set with the expected response header value.

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header", "This is the custom header value");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_HAVE_HEADER_STRING_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 4: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [String], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate for a given response header key that the header value does NOT match.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue, "notThisExpectedValue");
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [String] -  set with the expected response header value.

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header", "Not this value", "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_NOT_HAVE_HEADER_STRING_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 5: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [RegExp])```**
<br>
Validate response header key as string. Validate response header value as regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue);
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [RegExp] -  set with a regular expression to test against the expected response header value (e.g. /someregularexpression/).

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header", /the CUSTOM hEadEr VAL/i);
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_HAVE_HEADER_REGEXP_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 6: ```expectResponseToHaveHeader(expectedHeaderKey [String], expectedHeaderValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate response header key as string. Validate response header value does NOT match regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, expectedHeaderValue, "notThisExpectedValue);
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

expectedHeaderValue: [RegExp] -  set with a regular expression to test against the expected response header value (e.g. /someregularexpression/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header", /the CUSTOM hEadEr VAL/, "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_TO_NOT_HAVE_HEADER_REGEXP_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 7: ```expectResponseToHaveHeader(expectedHeaderKey [String], collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br>
Set a response header value as an collection variable.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseToHaveHeader(expectedHeaderKey, collectionVariableKey, "setAsCollectionVariable");
```

Function Details:
```
Inputs:
expectedHeaderKey: [String] - set with the expected response header key (case insensitive).

collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

Example:
```js
expectResponseToHaveHeader("custom-header", "custom-header-col-var-key", "setAsCollectionVariable");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_HEADER_SPECIAL_HANDLING_SET_AS_COLLECTION_VARIABLE.postman_collection.json).

</details>
<br><br>


<div id='expectResponseBodyToHaveProperty'/>

# expectResponseBodyToHaveProperty()

This function is used to validate a response body property (xml is internally converted to json).
<br>
<br>


**Function Type 1: ```expectResponseBodyToHaveProperty(jsonPath [String])```**
<br>
Validate property exists. Ignore property value.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath);
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("id.value");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_IGNORE_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 2: ```expectResponseBodyToHaveProperty(jsonPath [String], null, specialHandling [String] = "notThisExpectedKey")```**
<br>
Validate response body property does NOT exist (In this context, notThisExpectedKey is the jsonPath).
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, null, "notThisExpectedKey");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

null - set 2nd parameter to null.

specialHandling: [String] -  set with value "notThisExpectedKey".

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("id.notValid", null, "notThisExpectedKey");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_NOT_HAVE_RESPONSE_PROPERTY.postman_collection.json).

</details>
<br><br>


**Function Type 3: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String, Boolean, Number, or null])```**
<br>
Validate response body property exists with expected value and expected data type.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue);
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [String, Boolean, Number, or null] - set with the expected property value. Note: data type is also validated (i.e. String, Boolean, Number, or null).

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("string.value", "rl3FShupSKpo8tpe07JHKOk1rRrcrvEmtaUMKJfR3hM");
expectResponseBodyToHaveProperty("boolean.value", true);
expectResponseBodyToHaveProperty("number.value", 12345);
expectResponseBodyToHaveProperty("null.value", null);
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 4: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String, Boolean, Number, or null], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate response body property exists but NOT with a given value.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "notThisExpectedValue");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [String, Boolean, Number, or null] - set with the expected property value. Note: data type is also validated (i.e. String, Boolean, Number, or null).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("string.value", "XXXX", "notThisExpectedValue");
expectResponseBodyToHaveProperty("boolean.value", false, "notThisExpectedValue");
expectResponseBodyToHaveProperty("number.value", "12345", "notThisExpectedValue");
expectResponseBodyToHaveProperty("null.value", undefined, "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_BUT_NOT_WITH_GIVEN_VALUE.postman_collection.json).

</details>
<br><br>


**Function Type 5: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [RegExp])```**
<br>
Validate response body property exists with value matched against a regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue);
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [RegExp] - set with a regular expression to test against the expected json response property value (e.g. /someregularexpression/).

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("id.value", /^rl3FShupS/);
expectResponseBodyToHaveProperty("id.value", new RegExp("^rl3FShupS"));
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_REGEXP.postman_collection.json).

</details>
<br><br>


**Function Type 6: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [RegExp], specialHandling [String] = "notThisExpectedValue")```**
<br>
Validate response body property exists but does NOT match against a regular expression.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "notThisExpectedValue");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "balance.currentBalance.amount").

expectedValue: [RegExp] - set with a regular expression to test against the expected json response property value (e.g. /someregularexpression/).

specialHandling: [String] -  set with value "notThisExpectedValue".

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("id.value", /$rl3FShupS/, "notThisExpectedValue");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_BUT_NOT_WITH_REGEXP_MATCH.postman_collection.json).

</details>
<br><br>


**Function Type 7: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [Number], specialHandling [String] = "dateAsEpoch")```**
<br>
Validate response body property exists with expectedValue as +-secondsOffset and specialHandling dateAsEpoch.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "dateAsEpoch");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "nextPaymentDate").

expectedValue: [Number] - set with +-secondsOffset from now (e.g. -86400 will yesterday, 86400 will be tomorrow, 604800 will be 7 days from today).

specialHandling: [String] - set with "dateAsEpoch" will internally validate the expectedValue +-secondsOffset as an internally normalized date compared to the
actualValue epoch response also as an internally normalized date.

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("epoch.date", 0, 'dateAsEpoch');
expectResponseBodyToHaveProperty("epoch.date", 86400, 'dateAsEpoch');
expectResponseBodyToHaveProperty("epoch.date", -86400, 'dateAsEpoch');
expectResponseBodyToHaveProperty("epoch.date", 604800, 'dateAsEpoch');
expectResponseBodyToHaveProperty("epoch.date", -604800, 'dateAsEpoch');
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_VALUE_NUMBER_DATE_AS_EPOCH.postman_collection.json).

</details>
<br><br>


**Function Type 8: ```expectResponseBodyToHaveProperty(jsonPath [String], expectedValue [String], specialHandling [String] = "dateAsEpoch")```**
<br>
Validate response body property exists with expectedValue in string format "YYYY-MM-DD" and specialHandling dateAsEpoch.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, expectedValue, "dateAsEpoch");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path (e.g. "nextPaymentDate").

expectedValue: [String] - set with hard coded date in format "YYYY-MM-DD" (only first 10 chars of string are used) (e.g. "2012-10-31", "2012-10-31-07:00").

specialHandling: [String] - set with "dateAsEpoch" will internally validate the expectedValue hard coded date in format "YYYY-MM-DD" compared to the actualValue epoch response as an internally normalized date.

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("epoch.date", "2020-10-31", 'dateAsEpoch');
expectResponseBodyToHaveProperty("epoch.date", "2020-10-31-07:00", 'dateAsEpoch');
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_PROPERTY_VALUE_STRING_DATE_AS_EPOCH.postman_collection.json).

</details>
<br><br>


**Function Type 9: ```expectResponseBodyToHaveProperty(jsonPath [String], collectionVariableKey [String], specialHandling [String] = "setAsCollectionVariable")```**
<br>
Set a response body property as an collection variable.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveProperty(jsonPath, collectionVariableKey, "setAsCollectionVariable");
```

Function Details:
```
Inputs:
jsonPath: [String] - set with the expected json path.

collectionVariableKey: [String] - set with any arbitrary collection variable key you want to use.

specialHandling: [String] -  set with value "setAsCollectionVariable".

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveProperty("string.value", "stringValue", "setAsCollectionVariable");
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_RESPONSE_PROPERTY_SPECIAL_HANDLING_SET_AS_COLLECTION_VARIABLE.postman_collection.json).

</details>
<br><br>


<div id='expectResponseBodyToHaveUnorderedArray'/>

# expectResponseBodyToHaveUnorderedArray()

This function is used to validate a response body json array that does not have a sorted or consistent order.
<br>
<br>


**Function Type 1: ```expectResponseBodyToHaveUnorderedArray(jsonPathToArray [String], validationList [Simple Array])```**
<br>
Validate a response body with an unordered array that is of simple type (i.e. simple list of items).
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveUnorderedArray(jsonPathToArray, validationList);
```

Function Details:
```
Inputs:
jsonPathToArray: [String] - set with the json path to the unordered array (e.g. "items.numeric").

validationList: [Simple Array] - set with the list of expected items from the json simple array (e.g. [5, 4, 2, 3, 1]).

Output:
undefined
```

Example:
```js
expectResponseBodyToHaveUnorderedArray("items.alpha", [
    "d",
    "f",
    "b",
    "e",
    "a",
    "c"
]);
expectResponseBodyToHaveUnorderedArray("items.numeric", [
    3,
    5,
    9,
    1,
    10,
    6,
    8,
    4,
    7,
    2
]);
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_UNORDERED_ARRAY_SIMPLE.postman_collection.json).

</details>
<br><br>


**Function Type 2: ```expectResponseBodyToHaveUnorderedArray(jsonPathToArray [String], validationList [Array of Objects])```**
<br>
Validate a response body with an unordered array of objects.
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
expectResponseBodyToHaveUnorderedArray(jsonPathToArray, validationList);
```

Function Details:
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

Example:
```js
expectResponseBodyToHaveUnorderedArray("account", [
  {pathToProperty: "id.value", expectedValue: "account-id-KkG", specialHandling: "setAsCollectionVariable"},
  {pathToProperty: "description", expectedValue: "Checking Account"},
  {pathToProperty: "displayAccountNumber", expectedValue: "*3221"},
  {pathToProperty: "accountNumber.hostValue", expectedValue: "7436283221"},
  {pathToProperty: "category", expectedValue: "DEPOSIT"},
  {pathToProperty: "accountType", expectedValue: "CHECKING"},
  {pathToProperty: "balance.currentBalance.amount", expectedValue: 1184.73},
  {pathToProperty: "balance.availableBalance.amount", expectedValue: 1138.21},
  {pathToProperty: "asOfDate", expectedValue: -86400, specialHandling: "dateAsEpoch"},
  {pathToProperty: "accountStatus", expectedValue: "OPEN", specialHandling: undefined}
]);
```

Live Demo Showing Usage:
1. [Example 1: specialHandling dateAsEpoch](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_UNORDERED_ARRAY_OF_OBJECTS_1.postman_collection.json).
2. [Example 2: specialHandling setAsCollectionVariable](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_UNORDERED_ARRAY_OF_OBJECTS_2.postman_collection.json).
3. [Example 3: specialHandling notThisExpectedKey, notThisExpectedValue](./tests/postman/demo/XTEST_DEMO_EXPECT_RESPONSE_BODY_TO_HAVE_UNORDERED_ARRAY_OF_OBJECTS_3.postman_collection.json).

</details>
<br><br>


### Special Handling
There are a number of special handling options supported in the assertion functions above. This table provides an overview.

|Special Handling Identifier     | Description                                                                              | Supported in expectResponseStatusCodeToBe() | Supported in expectResponseToHaveHeader() | Supported in expectResponseBodyToHaveProperty() | Supported in expectResponseBodyToHaveUnorderedArray() |
|--------------------------------|------------------------------------------------------------------------------------------|---------------------------------------------|-------------------------------------------|-------------------------------------------------|-------------------------------------------------------|
|`setAsEnvironmentVariable`      | Set actualValue to a Postman `Environment` type variable.                                | Yes                                         | Yes                                       | Yes                                             | Yes                                                   |
|`setAsCollectionVariable`       | Set actualValue to a Postman `Collection` type variable.                                 | Yes                                         | Yes                                       | Yes                                             | Yes                                                   |
|`notThisExpectedKey`            | Assert that property `key` does not exist.                                               | No                                          | Yes                                       | Yes                                             | Yes                                                   |
|`notThisExpectedValue`          | Assert that property `value` does not exist.                                             | Yes                                         | Yes                                       | Yes                                             | No (TBD)                                              |
|`dateAsEpoch`                   | Assert that property value is valid epoch formatted date (internally normalized).        | No                                          | No                                        | Yes                                             | Yes                                                   |
|`dateWithin1Sec`                | Assert that property value is a date/time within +- 1 second tolerance.                  | No                                          | No                                        | Yes                                             | Yes                                                   |
|`isArrayAndEmpty`               | Assert that property is an Array type and is empty.                                      | No                                          | No                                        | Yes                                             | Yes                                                   |
|`isArrayAndNotEmpty`            | Assert that property is an Array type and is NOT empty.                                  | No                                          | No                                        | Yes                                             | Yes                                                   |


## Helper Functions

<div id='date'/>

### date()

This function can be used to dynamically generate a date/time value in any required format. [See here for supported dateFormat specifiers.](https://github.com/samsonjs/strftime/blob/master/Readme.md#supported-specifiers)
<details>
  <summary>Click for details.</summary>

Function Name and Parameters:
```js
date(dateFormat, secondsOffset, timeZoneScheme);
```

Function Details:
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

Example 1: date() return UTC formatted date as of *now* (i.e. no offset):
```js
date('%Y-%m-%dT%H:%M:%SZ', 0, Z)
```

Live Demo Showing Usage - [see here](./tests/postman/demo/XTEST_DEMO_DATE.postman_collection.json).

</details>
<br><br>
