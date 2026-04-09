import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      password: a.string().required(),
      isAdmin: a.boolean().default(false),
      avatar: a.string(),
      walkingPoints: a.integer().default(0),
      gachaPoints: a.integer().default(0),
      registeredAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  WalkRecord: a
    .model({
      userId: a.string().required(),
      date: a.string().required(),
      distance: a.integer().required(),
      points: a.integer().required(),
      location: a.string(),
      type: a.string().required(),
      path: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Event: a
    .model({
      title: a.string().required(),
      description: a.string(),
      date: a.string(),
      time: a.string(),
      bonusPoints: a.integer().default(0),
      checkpoints: a.json(),
      participants: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ChatMessage: a
    .model({
      eventId: a.string().required(),
      userId: a.string().required(),
      username: a.string().required(),
      message: a.string().required(),
      isAdmin: a.boolean().default(false),
      timestamp: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
