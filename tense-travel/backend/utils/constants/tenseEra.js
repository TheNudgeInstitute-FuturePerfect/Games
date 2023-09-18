const ObjectID = require("mongodb").ObjectId;

const tenseJson = [
  {
    title: "Present",
    description: "",
    sequence: 1,
    status: "active",
    type: "tense",
    stage: [
      {
        _id: new ObjectID(),
        title: "Simple present",
        sequence: 1,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Present continuous",
        sequence: 2,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Present perfect",
        sequence: 3,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Boss level",
        sequence: 4,
        description: "",
      },
    ],
  },
  {
    title: "Past",
    description: "",
    sequence: 2,
    status: "active",
    type: "tense",
    stage: [
      {
        _id: new ObjectID(),
        title: "Simple past",
        sequence: 1,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Past continuous",
        sequence: 2,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Past perfect",
        sequence: 3,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Boss level",
        sequence: 4,
        description: "",
      },
    ],
  },
  {
    title: "Future",
    description: "",
    sequence: 3,
    status: "active",
    type: "tense",
    stage: [
      {
        _id: new ObjectID(),
        title: "Simple future",
        sequence: 1,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Future continuous",
        sequence: 2,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Future perfect",
        sequence: 3,
        description: "",
      },
      {
        _id: new ObjectID(),
        title: "Boss level",
        sequence: 4,
        description: "",
      },
    ],
  },
];

module.exports = Object.freeze(tenseJson);
