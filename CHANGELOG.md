# Change Log


## v1.3.0
1. Add new specialHandling: `isArrayAndHasLength` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_IS_ARRAY_AND_HAS_LENGTH.postman_collection.json)
2. Add specialHandling = `notThisExpectedValue` support to expectResponseBodyToHaveUnorderedArray() when strictValidationEnabled = false. [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_NOT_THIS_EXPECTED_VALUE_FOR_UNORDERED_ARRAY_OF_OBJECTS.postman_collection.json)
3. Fix for specialHandling = `isArrayAndEmpty` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_IS_ARRAY_AND_EMPTY.postman_collection.json) and `isArrayAndNotEmpty` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_IS_ARRAY_AND_NOT_EMPTY.postman_collection.json) - fail null values as null is not an array.

## v1.2.2
1. Fix/add support to expectResponseBodyToHaveUnorderedArray() when jsonPathToArray is
 empty.

## v1.2.1
1. Don't fail unsupported contentTypes, instead log as warn and move along.

## v1.2.0
1. Better response body parsing.
2. Add support for content-type: `text/plain`
3. Add new specialHandling: `dateWithin1Sec` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_DATE_WITHIN_1_SECOND.postman_collection.json)
4. Add new specialHandling: `isArrayAndEmpty` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_IS_ARRAY_AND_EMPTY.postman_collection.json)
5. Add new specialHandling: `isArrayAndNotEmpty` [(see example test)](tests/postman/demo/XTEST_DEMO_SPECIAL_HANDLING_IS_ARRAY_AND_NOT_EMPTY.postman_collection.json)
6. Documentation Updates.
7. Other fixes/improvements.