const fs = require("fs");
const path = require("path");
const process = require("process");

const BUCKET_NAME = undefined;
const REGION = undefined;

const printMemoryStats = () => {
  const formatMemmoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

  const memoryData = process.memoryUsage();

  const memmoryUsage = {
    rss: `${formatMemmoryUsage(memoryData.rss)}`,
    heapTotal: `${formatMemmoryUsage(memoryData.heapTotal)}`,
    heapUsed: `${formatMemmoryUsage(memoryData.heapUsed)}`,
    external: `${formatMemmoryUsage(memoryData.external)}`,
  };

  console.log(memmoryUsage);
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const uploadFiles = () => {
  if (!BUCKET_NAME) {
    console.log("🚨 Please make sure to set BUCKET_NAME, line 5 in index.js");
    return;
  }

  if (!REGION) {
    console.log("🚨 Please make sure to set REGION, line 6 in index.js");
    return;
  }

  printMemoryStats();
  const appDir = path.dirname(require.main.filename);

  const filesDir = `${appDir}/files/`;

  fs.readdir(filesDir, async (err, files) => {
    for (const file of files) {
      console.log(`⏫ Uploading ${file}...`);
      const data = fs.readFileSync(`${filesDir}${file}`);

      if (err) throw err;

      const params = {
        Bucket: BUCKET_NAME,
        Key: path.basename(`${filesDir}${file}`),
        Body: data,
      };
      const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
      const s3 = new S3Client({ region: REGION });

      const data1 = await s3.send(new PutObjectCommand(params));

      console.log(`✅ Uploaded File: ${file} ETag ${data1.ETag}`);
      printMemoryStats();

      console.log("⏰ Sleeping for 10 seconds before new memory stats...");
      await sleep(10000);
      printMemoryStats();
    }
  });
};

uploadFiles();
