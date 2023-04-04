require('dotenv').config()
const AWS = require('aws-sdk')

const providerName = process.env.COGNITO_USER_POOL_PROVIDER_NAME

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  Logins: {
    [providerName]: 'eyJraWQiOiJsXC9XeVB2dXdKTUF6SXRyZGJ1ZUVKWm1NWE94OGluR0k5SWQrSHZndndFMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwYzQ1NjQ0ZS0zZjE4LTRhNjktYWQ0NS1hZmU1ODgzMjI1ZDciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfbElib3NpVlZyIiwiY29nbml0bzp1c2VybmFtZSI6IjBjNDU2NDRlLTNmMTgtNGE2OS1hZDQ1LWFmZTU4ODMyMjVkNyIsIm9yaWdpbl9qdGkiOiI2NWJkZDk0MC0zZDEwLTRlZTMtODhjMC1jZmZiYTA0Mjc1NDEiLCJhdWQiOiI1ZW1rYXE4OGpsbDVvczFpYmV2aGltaXF1cyIsImV2ZW50X2lkIjoiYWU4MjBkOWItMzU5Ni00MzU0LTg3NDMtYzBmNDc2NTA2NGRmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODA1MDYxNjAsIm5hbWUiOiJKb2huIEcgS291a2FyYXMiLCJleHAiOjE2ODA1MDk3NjAsImlhdCI6MTY4MDUwNjE2MCwianRpIjoiY2MxOGRiMjQtMjRiNi00MWMzLWJmN2EtZGFlOTk5ZjlhMWFjIiwiZW1haWwiOiJqb2hua0B0YW5nZW50c29sdXRpb25zLmNvLnphIn0.p-NXuUylW754EH0mMP8OmYSwyZJrhLgbFqk_JhvkYZFdGUgKQMgYN_pOet-1cD3vUp18qowgzRg3qcJcIKXx80WXbt03Ws4Uwc2u3Ch_BuoP5uKc4-n-E9EPAFROvUnJ53kwVskXVtLj0w5u2l1o6AnCQadebLRtiY9W1t-HaThKfsZtbJT5TVHylTwOiPckalp4jm6-KJi8cf1AITj5tUQQorA14m0I6g_L0EkEIhz3SiomhkEjAJZxjn0i4CYjq9NJ-ntv7tYUeOcBDNjqvxAQgXaL5OF9JPSh05WnZc33wF20OqVMdjLRh1W5Rbl-TqW1xK0tVIqNfQ5Q3dtg0w'
  }
})

AWS.config.credentials.get(function() {
  const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials
  process.env.AWS_ACCESS_KEY_ID = accessKeyId
  process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey
  process.env.AWS_SESSION_TOKEN = sessionToken

  const Firehose = new AWS.Firehose()
  Firehose.putRecord({
    DeliveryStreamName: process.env.FIREHOSE_STREAM_NAME,
    Record: {
      Data: JSON.stringify({
        eventType: 'impression',
        tweetId: '123'
      })
    }
  }).promise()
  .then(() => console.log('all done'))
  .catch(err => console.error('failed', err))

})