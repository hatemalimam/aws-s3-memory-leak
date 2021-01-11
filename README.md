# aws-s3-memory-leak
Example of AWS S3 Upload memory leak, related to this [issue](https://github.com/aws/aws-sdk-js-v3/issues/1897)

**Describe the bug**

There's an apparent leak of memory when a file gets uploaded to S3, the rss memory keeps growing and never gets garbage collected.

**SDK version number**
3.2.0

**Is the issue in the browser/Node.js/ReactNative?**
Node.js

**Details of the browser/Node.js/ReactNative version**
v12.16.1

**To Reproduce (observed behavior)**
Clone https://github.com/hatemalimam/aws-s3-memory-leak make sure to set `BUCKET_NAME` and `REGION` in index.js,
there are some test files in files directory, when executing `yarn start` the files in that directory are uploaded sequentially, and there are memory stats before uploading the files, right after, and a delay of 10 seconds after each upload to allow any GC. 

**Expected behavior**
The RSS memory should free up.

**Screenshots**
![Screenshot 2021-01-11 at 20 58 21](https://user-images.githubusercontent.com/3439970/104219876-bfaf0500-544f-11eb-976b-9f73aa76c532.png)

