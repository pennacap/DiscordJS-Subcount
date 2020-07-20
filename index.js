const Discord = require("discord.js");
const client = new Discord.Client();
var request = require("request");
var CronJob = require("cron").CronJob;
var id = "YOUTUBE-CHANNEL-ID";
var key = "YOUTUBE-API-KEY";
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
];

const abbreviateNumber = (number) => {
  if (number === 0) return number;

  const tier = SI_PREFIXES.filter((n) => number >= n.value).pop();
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

        let guild = client.guilds.cache.get("GUILD-ID");
        let SubChannel = guild.channels.cache.get("CHANNEL-ID");
        let VideoChannel = guild.channels.cache.get("CHANNEL-ID");
        let ViewsChannel = guild.channels.cache.get("CHANNEL-ID");
        TotalViews = json.items[0].statistics.viewCount;
        Subscribers = json.items[0].statistics.subscriberCount;
        VideoCount = json.items[0].statistics.videoCount;
        SubChannel.edit({ name: `Name: ${abbreviateNumber(Subscribers)}` });
        VideoChannel.edit({ name: `Video Count: ${VideoCount}` });
        ViewsChannel.edit({
          name: `Total Views: ${abbreviateNumber(TotalViews)}`,
        });
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

client.login("YOUR-TOKEN-HERE");
