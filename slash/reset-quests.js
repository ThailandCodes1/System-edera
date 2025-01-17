const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
const config = require(`../config.json`)
const prefix = config.prefix;
const serverid = config.serverid
const staffrole = config.staffrole
const QUESTS = [
  {
    name: 'قم بإرسال 1000 رسالة',
    type: 'message',
    goal: 1000,
    reward: 8,
  },
  {
    name: 'قم بإرسال 500 رسالة',
    type: 'message',
    goal: 500,
    reward: 3,
  },
  {
    name: 'قم بإرسال 750 رسالة',
    type: 'message',
    goal: 750,
    reward: 6,
  },
  {
    name: 'قم بإرسال 600 رسالة',
    type: 'message',
    goal: 600,
    reward: 4,
  },
  {
    name: 'قم بإرسال 400 رسالة',
    type: 'message',
    goal: 400,
    reward: 2,
  },
  {
    name: 'قم بإرسال 850 رسالة',
    type: 'message',
    goal: 850,
    reward: 7,
  },
    {
    name: 'قم باستلام 4 تكت',
    type: 'ticket',
    goal: 4,
    reward: 6,
  },
   {
    name: 'قم باستلام 10 تكتات',
    type: 'ticket',
    goal: 10,
    reward: 12,
  },
    {
    name: 'قم باستلام 6 تكتات',
    type: 'ticket',
    goal: 6,
    reward: 8,
  },
    {
    name: 'قم باستلام 5 تكتات',
    type: 'ticket',
    goal: 5,
    reward: 7,
  },
  {
    name: 'قم بإرسال 350 رسالة',
    type: 'message',
    goal: 350,
    reward: 3,
  },
];



  


module.exports = {
  name: 'reset-quests',
  description: 'Reset The Quests Of All The Staff Or A Specifec User',
  options: [
    {
      name: `user`,
      description: `user to reset points`,
      type: `USER`,
      required: false
    }
  ],
  run: async (client, interaction, db) => {
   if (!interaction.member.permissions.has(`ADMINSTRATOR`)) {
      return interaction.reply({
        content: `**You Don't Have Perms To Use This Command**`,
        ephemeral: true
      });
    }


  let u = interaction.options.getUser("user")

if (u) {
  db.set(`quests_${u.id}`, gq([]));
      interaction.reply({content: `**You Have Reseted The quests Of ${u} Successfully :white_check_mark:**`})
  
}
    else {
      const guild = client.guilds.cache.get(serverid);
const staffRole = guild.roles.cache.get(staffrole);

if (!staffRole) {
  return interaction.reply({content: `**The staff role does not exist**`, ephemeral: true});
}

const stafmem = guild.members.cache.filter(member => member.roles.cache.has(staffRole.id));

stafmem.forEach((member) => {
  db.set(`quests_${member.id}`, gq([]));
});

interaction.reply({content: `**You Have Reseted The Quests Of All Staffs Successfully :white_check_mark:**`})
    }
function gq(quests) {
  quests = quests || []; // Initialize as empty array if undefined
  let msgquests, vcq;

  do {
    msgquests = QUESTS.filter(q => q.type === "message")[Math.floor(Math.random() * QUESTS.filter(q => q.type === "message").length)];
  } while (quests.find((q) => q.name === msgquests.name));

  do {
    vcq = QUESTS.filter(q => q.type === "ticket")[Math.floor(Math.random() * QUESTS.filter(q => q.type === "ticket").length)];
  } while (quests.find((q) => q.name === vcq.name));

  return [
    { ...msgquests, progress: 0, completed: false },
    { ...vcq, progress: 0, completed: false }
  ];
}
  }
}
