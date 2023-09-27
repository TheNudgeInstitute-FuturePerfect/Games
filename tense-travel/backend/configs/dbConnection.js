const mongoose = require("mongoose");
const isEmpty = require("lodash.isempty");
require("dotenv").config();
const modelLists = mongoose.models;
const { eraTenseModel } = require("../models/index");
const tenseJson = require("../utils/constants/tenseEra");

const env = process.env.NODE_ENV;
const config = require(`${__dirname}/configuration`)[env];

mongoose.Promise = Promise;
mongoose.connection.on("connected", () => {
  console.log("Connection Established");
});

mongoose.connection.on("reconnected", () => {
  console.log("Connection ReEstablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("Connection Disconnected");
  mongoose.connection
    .close()
    .then(() => {
      console.log("Connection Closed Explicitly: ");
    })
    .catch((err) => {
      console.error("Connection Closed Explicitly: ", er);
    });
});

mongoose.connection.on("error", (error) => {
  mongoose.connection
    .close()
    .then(() => {
      console.log("Connection Closed Explicitly");
    })
    .catch((er) => {
      console.error("Connection Closed Explicitly: ", er);
    });
});

const connectToDb = async () => {
  const dbConnection =
    config.databaseSettings.dialect +
    config.databaseSettings.username +
    config.databaseSettings.password +
    config.databaseSettings.host +
    config.databaseSettings.params;

  await mongoose
    .connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async (data) => {
      try {
                /* Insert tenses */
        const tenseTitle = tenseJson.map((item) => item.title);
        const checkTense = await eraTenseModel.find({
          title: { $in: tenseTitle },
          type: "tense",
        });
        const options = { ordered: true };

        if (isEmpty(checkTense)) {
          await eraTenseModel.insertMany(tenseJson, options);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }

      console.log("Connected to DB");
    })
    .catch((error) => {
      console.error("Error connecting to DB", error);
    });
};

module.exports = { connectToDb, mongoose };
