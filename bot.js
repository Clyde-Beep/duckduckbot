// use this to invite bot
// https://discordapp.com/oauth2/authorize?client_id=318945898115760129&scope=bot&permissions=0

//First of all, we need to load the dependencies we downloaded!
const logger = require("winston");
const Discordbot = require('discord.io');
const DataManager = require('./datamanager');

//Let's change some settings!
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize : true
});
logger.level = 'debug';

//Here we create our bot variable, this is what we're going to use to communicate to discord.
const bot = new Discordbot.Client({
  autorun: false,
  token: "MzE4OTQ1ODk4MTE1NzYwMTI5.DA52LQ.YqZ4fVBJINKAxDDUTq0jWJVRjDo"
});

bot.on("ready", function (rawEvent) {
  logger.info("Connected!");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
  let getInviteURL = () => {
    if (bot.bot) {
      if (bot.inviteURL) {
        logger.info(`Invite URL: ${bot.inviteURL}`);
      } else {
        setTimeout(getInviteURL, 1000);
      }
    }
  };
  getInviteURL();
});

function roll()
{
  return Math.floor((Math.random() * 6) + 1);
}

//In this function we're going to add our commands.
bot.on("message", function (user, userID, channelID, message, rawEvent) {
  if (message.substring(0, 1) == "!") {
    let args = message.substring(1).split(" ");
    let command = args[0];
    args = args.splice(1);

    if (command == "ping") {//If the user posts '!ping' we'll do something!
      bot.sendMessage({ //We're going to send a message!
        to : channelID,
        message : "Pong!"
      });
    }
    else if (command == "roll" && args.length == 1) {
      let numbers = [];
      let rollCount = parseInt(args[0]);
      if (rollCount > 0)
      {
        console.log(`${user} (${userID}) on channel ${channelID} is rolling`);
        let message = "Rolling " + rollCount + (rollCount == 1 ? " die" : " dice") + "\n>>> ";
        let successes = 0;
        while (rollCount > 0)
        {
          let reRoll = 0;
          for (let i = 0; i < rollCount; ++i)
          {
            let dice = user == 'Legion' ? Math.floor((Math.random() * 6) + 1) : roll();
            if (dice == 1)
            {
              message += "**" + dice + "**";
              ++successes;
            }
            else if (dice == 6)
            {
              message += "***" + dice + "***";
              ++reRoll;
              ++successes;
            }
            else
            {
              message += dice;
            }

            if (i + 1 == rollCount)
            {
              message += "\n";
            }
            else
            {
              message += ", ";
            }
          }

          if (reRoll > 0)
          {
            message += "\nRe-rolling " + reRoll + (reRoll > 1 ? " sixes" : " six") + "\n>>> ";
          }
          rollCount = reRoll;
        }
        message += "\n**RESULT:** " + successes + (successes == 1 ? " success" : " successes");
        bot.sendMessage({
          to : channelID,
          message : message
        });
      }
    }
  }
});

bot.connect();
