const DynamoDB = require('aws-sdk/clients/dynamodb')
const { TweetTypes } = require('../lib/constants')
const graphql = require('graphql-tag')
const { mutate } = require('../lib/graphql')
const ulid = require('ulid')
const { getTweetById } = require('../lib/tweets')

module.exports.handler = async (event) => {
  console.log("###notify function###")
  console.log("###notify function event " + event)
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const tweet = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
      console.log("!!debugging insert tweet from stream " + tweet)
      switch (tweet.__typename) {
        case TweetTypes.RETWEET:
          console.log("!!debugging before notifyRetweet" + TweetTypes.RETWEET)
          await notifyRetweet(tweet)
          break
      }
    }
  }
}

async function notifyRetweet(tweet) {
  console.log("!!debugging notifyRetweet ")
  const retweetOf = await getTweetById(tweet.retweetOf)
  console.log("!!debugging notifyRetweet retweetOf " + retweetOf)
  
  await mutate(graphql `mutation notifyRetweeted(
    $id: ID!
    $userId: ID!
    $tweetId: ID!
    $retweetedBy: ID!
    $retweetId: ID!
  ) {
    notifyRetweeted(
      id: $id
      userId: $userId
      tweetId: $tweetId
      retweetedBy: $retweetedBy
      retweetId: $retweetId
    ) {
      __typename
      ... on Retweeted {
        id
        type
        userId
        tweetId
        retweetedBy
        retweetId
        createdAt
      }
    }
  }`, {
    id: ulid.ulid(),
    userId: retweetOf.creator,
    tweetId: tweet.retweetOf,
    retweetId: tweet.id,
    retweetedBy: tweet.creator
  })
}
