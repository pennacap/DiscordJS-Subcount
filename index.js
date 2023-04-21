const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request");
const { CronJob } = require("cron");

require('dotenv').config()



var id = process.env.CHANNEL_ID;
var key = process.env.API_KEY;
var url =
  "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" +
  id +
  "&key=" +
  key;
const SI_PREFIXES = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
].reverse();

const abbreviateNumber = (number) => {
  if (number === 0) return number;

  const tier = SI_PREFIXES.find((n) => number >= n.value);
  const numberFixed = (number / tier.value).toFixed(1);

  return `${numberFixed}${tier.symbol}`;
};
var job = new CronJob(
  "*/10 * * * *",
  function () {
    request(
      {
        method: "GET",
        url: url,
      },
      function (err, response, text) {
        if (err) {
          return;
        }

        var json = JSON.parse(text);

        let guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (process.env.SUB_CATEGORY_ID){
          let SubChannel = guild.channels.cache.get(process.env.SUB_CATEGORY_ID);
          let Subscribers = json.items[0].statistics.subscriberCount;  
          SubChannel.edit({ name: `Name: ${abbreviateNumber(Subscribers)}` });  
        }
        if (process.env.VID_CATEGORY_ID) {
          let VideoChannel = guild.channels.cache.get(process.env.VID_CATEGORY_ID));
          let TotalViews = json.items[0].statistics.viewCount;  
          VideoChannel.edit({ name: `Video Count: ${VideoCount}` });
        }
        if (process.env.VIEWS_CATEGORY_ID) {
          let ViewsChannel = guild.channels.cache.get(process.env.VIEWS_CATEGORY_ID));
          let VideoCount = json.items[0].statistics.videoCount;
        
        
          ViewsChannel.edit({
            name: `Total Views: ${abbreviateNumber(TotalViews)}`,
          });
        }
        console.log("Channels Updated");
      }
    );
  },
  null,
  true,
  "America/Los_Angeles"
);
client.on("ready", () => {
  console.log("Bot started!");
  job.start();
});

client.login(process.env.TOKEN);
