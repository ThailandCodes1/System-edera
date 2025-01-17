require("events").EventEmitter.defaultMaxListeners = 200;
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const fs = require("fs");
const {MessageEmbed,MessageActionRow,MessageButton} = require("discord.js");
const db = require(`quick.db`)
const config = require(`./config.json`)
const ca = require(`./config.json`)
client.cmds = new Discord.Collection();
const cmds = client.cmds;

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)); 

//config :
const prefix = config.prefix;
const serverid = config.serverid
const staffrole = config.staffrole

//config explaination: 
/*
1- Bot Prefix / بريفكس بوتك
2- Staff Role Id / ايدي رول الادارة
3- Server id / ايدي السيرفر
*/
///////////////////////////////////
client.on("ready", () => {
  console.log(`Logged As ${client.user.tag}`);
  console.log(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&scope=applications.commands`)
  client.user.setStatus(`idle`)
  db.set(`staffrole`, staffrole)
 setInterval(() => {
  const current = Date.now();
       const guild = client.guilds.cache.get(serverid);
const staffRole = guild.roles.cache.get(staffrole);


const staffmem = guild.members.cache.filter(member => member.roles.cache.has(staffRole.id));

  staffmem.forEach((user) => {
    const last = db.get(`quests_${user.id}_last_reset`) || 0;
    const reset = current - last;
    if (reset >= 86400000) {
      db.set(`quests_${user.id}`, genquest([]));
      db.set(`quests_${user.id}_last_reset`, current);
      console.log(`Quests reset for user ${user.user.tag}`);
    }
  });

}, 180000);
  
});


fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event] Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});


client.interactions = new Discord.Collection();
client.register_arr = []
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
})

let stid = config.staffrole
let role = config.staffrole

setInterval(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  }
}, 3000);
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


function genquest(quests) {
  quests = quests || []; 
  let msgquest, tktquest;

  do {
    msgquest = QUESTS.filter(q => q.type === "message")[Math.floor(Math.random() * QUESTS.filter(q => q.type === "message").length)];
  } while (quests.find((q) => q.name === msgquest.name));

  do {
    tktquest = QUESTS.filter(q => q.type === "ticket")[Math.floor(Math.random() * QUESTS.filter(q => q.type === "ticket").length)];
  } while (quests.find((q) => q.name === tktquest.name));

  return [
    { ...msgquest, progress: 0, completed: false },
    { ...tktquest, progress: 0, completed: false }
  ];
}


client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
if (message.content.startsWith(prefix + "مهامي")) {
   if (!message.member.roles.cache.has(role)) {
      return message.reply({content: `**انت لست اداري**`, ephemeral: true});
    }
  const userId = message.author.id;
  const userQuests = db.get(`quests_${userId}`) || [];

    const msgquests = userQuests.filter((quest) => quest.type === 'message');
  const msgquest = msgquests[0];
  const tktquests = userQuests.filter((quest) => quest.type === 'ticket');
  const tckquest = tktquests[0];
  const embed = new Discord.MessageEmbed()
    .setDescription('هذه مهامك الحالية:')
    .setColor('#0099ff');

  if (msgquest) {
    const msgprogresspercent = Math.min(100, (msgquest.progress / msgquest.goal) * 100);
    const messageProgressStr = `${msgquest.progress}/${msgquest.goal} (${msgprogresspercent.toFixed(0)}%)`;
    embed.addField(`1 - ${msgquest.completed ? ':white_check_mark:' : ':x:'} ${msgquest.name}`, `**التقدم:** ${messageProgressStr}\n**المكافأة:** ${msgquest.reward} نقطة`);
  } else {
    embed.addField('ليس لديك مهمة رسائل في الوقت الحالي', '\u200b');
  }


if (tckquest) {  
      const ff = `${tckquest.progress}/${tckquest.goal}`;
embed.addField(`2 - ${tckquest.completed ? ':white_check_mark:' : ':x:'} ${tckquest.name}`, `**التقدم:** ${ff}\n**المكافأة:** ${tckquest.reward} نقطة`);
} else {
  embed.addField('ليس لديك مهمة تكت في الوقت الحالي', '\u200b');
}

message.reply({ embeds: [embed] });

}
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
if (message.content.startsWith(prefix + "نقاط")) {
  let user = message.mentions.members.first() || message.author;

if (stid && message.guild && user.id !== message.author.id) {
  let member = message.guild.members.cache.get(user.id);
  if (!member || !member.roles.cache.has(stid)) {
    return message.reply({content: `**هذا ليس أداريًا**`, ephemeral: true});
  }
}
    let points = db.get(`points_${user.id}`) || 0;
let user2 = user.user || message.author;
const embed = new Discord.MessageEmbed()
  .setAuthor(user2.username, user2.avatarURL({ dynamic: true }))
     .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTitle(`نقاط الادارة`)
      .setColor("BLURPLE")
      .setDescription(`** ${
        user.id === message.author.id ? 'نقاطك' : ` نقاط <@${user.id}>`
      } : \`${points}\` **`)
         .setFooter(`Requested By ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));;

    message.reply({
      embeds: [embed]
    });
}
})
const cooldowns = new Map();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
if (message.content.startsWith(prefix + "شكر")) {
  let u = message.mentions.members.first()
    let p = message.content.split(" ").slice(2).join(" ")
    const now = Date.now();
    const cdamount = 30 * 60 * 1000; 
if (role && message.guild && u.id !== message.author.id) {
  let member = message.guild.members.cache.get(u.id);
  if (!member || !member.roles.cache.has(role)) {
    return message.reply({content: `**هذا ليس أداريًا**`, ephemeral: true});
  }
}
    if (message.member.roles.cache.has(role)) {
      return message.reply({content: `**هذا الامر للاعضاء فقط**`, ephemeral: true});
    }
  if (u.id === message.author.id) {
    return message.reply(`**لا تستطيع شكر نفسك**`)
  }
  
    const userid = message.author.id;
    if (cooldowns.has(userid)) {
      const expiret = cooldowns.get(userid) + cdamount;

      if (now < expiret) {
        const tleft = (expiret - now) / 1000 / 60;
        return message.reply({content:`**Please wait ${tleft.toFixed(1)} more minutes before thanking someone again.**`});
      }
    }
      db.add(`points_${u.id}`, 1)
    
    message.reply({content: `**لقد شكرت ${u}\n لسبب: \`${p}\`\n تم اضافة نقطة ل ${u} :white_check_mark:**`})
}
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
if (message.content.startsWith(prefix + "راتبي")) {
   if (!message.member.roles.cache.has(staffrole)) {
      return message.reply({content: `**انت لست اداري**`, ephemeral: true});
    }
const dcd = 24 * 60 * 60 * 1000;
  let last = db.get(`lastDaily_${message.author.id}`) || 0;

    let remaining = dcd - (Date.now() - last);

    if (remaining > 0) {
      return message.reply({
        content: `**You have already claimed your daily reward! You can claim it again in ${Math.floor(remaining / 3600000)} hours and ${Math.floor((remaining % 3600000) / 60000)} minutes.**`,
        ephemeral: true
      });
    }

    
    let points = Math.floor(Math.random() * 9) + 2;
let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTitle(`الراتب اليومي`)
      .setColor("BLURPLE")
      .setDescription(`**تهانينا! لقد استلمت علاوة و اخذت ${points} نقطة اليوم!**`);
let embed2 = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTitle(`الراتب اليومي`)
      .setColor("BLURPLE")
      .setDescription(`**استلمت راتبك اليومي و اخذت \`${points}\` نقطة!**`);

    if (Math.random() < 0.1) {
      points += Math.floor(Math.random() * 6) + 1;
      message.reply({
        embeds: [embed]
      });
    } else {
      message.reply({
        embeds: [embed2]
      });
    }
    db.add(`points_${message.author.id}`, points);
    db.set(`lastDaily_${message.author.id}`, Date.now());

}
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
if (message.content.startsWith(prefix + "توب")) {
  let role = db.get(`staffrole`);

      if (!message.member.roles.cache.has(role)) {
      return message.reply({content: `**انت لست اداري**`, ephemeral: true});
    }
  let Balance = db.all().filter(data => data.ID.startsWith(`points`)).sort((a, b) => b.data - a.data);
if (Balance.length === 0) {
  return interaction.reply({content: '**No One In DB Now**'});
}

const PAGE_SIZE = 10;
const numPages = Math.ceil(Balance.length / PAGE_SIZE);
let page = 0;

const embd = () => {
  const leaderboard = Balance.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const finalLeaderboard = leaderboard
    .map((data, index) => {
      const user = client.users.cache.get(data.ID.split('_')[1]);
      const tag = user ? user.tag : 'Unknown User#0000';
      return `** #${page * PAGE_SIZE + index + 1} | <@${data.ID.split('_')[1]}>** | **\`${data.data.toLocaleString()}\`p **\n`;
    })
    .join('');

  const embed = new Discord.MessageEmbed()
    .setAuthor(`اعلى اداريين`, client.user.displayAvatarURL({ dynamic: true }))
    .setColor('BLURPLE')
    .setDescription(finalLeaderboard)
    .setFooter(`Page ${page + 1}/${numPages} (${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, Balance.length)} of ${Balance.length}) | ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));

  return embed;
};


message.reply({
  embeds: [embd()],
  components: [
    new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton().setCustomId('prev').setLabel('⬅️').setStyle('PRIMARY').setDisabled(true),
      new Discord.MessageButton().setCustomId('next').setLabel('➡️').setStyle('PRIMARY').setDisabled(numPages <= 1)
    )
  ]
}).then(msg => {
    if (!msg) return;

  const prev = msg.components[0].components.find(component => component.customId === 'prev');
  const next = msg.components[0].components.find(component => component.customId === 'next');

  const startIndex = page * 10;
  const endIndex = Math.min(startIndex + 10, Balance.length);
  var lead = '';
  for (let i = startIndex; i < endIndex; i++) {
    if (Balance[i].data === null) Balance[i].data = '0';
    lead += `** #${i + 1} | <@${Balance[i].ID.split('_')[1]}> | \`${Balance[i].data.toLocaleString()}\`p **\n`;
  }
  embd().setDescription(`${lead}`);

  msg.edit({ embeds: [embd()], components: [new Discord.MessageActionRow().addComponents(
    prev.setDisabled(page === 0),
    next.setDisabled(endIndex === Balance.length),
  )]});
  const filter = (i) => ['prev', 'next'].includes(i.customId) && i.user.id === message.author.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', interaction => {
    if (interaction.customId === 'prev' && page > 0) {
        interaction.deferUpdate()
      page--;
    } else if (interaction.customId === 'next' && endIndex < Balance.length) {
                interaction.deferUpdate()
      page++;
    }


    lead = '';
    for (var i = startIndex; i < endIndex; i++) {
      if (Balance[i].data === null) Balance[i].data = '0';
      lead += `** #${i + 1} | <@${Balance[i].ID.split('_')[1]}>** **\`${Balance[i].data.toLocaleString()}\`p **\n`;
    }
    embd().setDescription(`${lead}`);
    msg.edit({ embeds: [embd()], components: [new Discord.MessageActionRow().addComponents(
      prev.setDisabled(page === 0),
      next.setDisabled(endIndex === Balance.length),
    )]});
  });

  collector.on('end', () => {
    prev.setDisabled(true);
    next.setDisabled(true);
    msg.edit({ components: [new Discord.MessageActionRow().addComponents(
      prev, next,
    )]});
  });
})

}
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  await handleMessage(message, db);
});
async function handleMessage(message, db) {
  const uid = message.author.id;
  const userQuests = db.get(`quests_${uid}`) || [];
  
  userQuests.forEach(userQuest => {
    if (userQuest.type === 'message' && !userQuest.completed) {
      userQuest.progress += 1;

      if (userQuest.progress >= userQuest.goal) {
        userQuest.progress = userQuest.goal;
        userQuest.completed = true;

        const reward = userQuest.reward || 1;
        db.add(`points_${uid}`, reward);
    
      }
    }
  });
  
  db.set(`quests_${uid}`, userQuests);
}


client.on('channelCreate', async channel => {
          if(channel.name.startsWith('ticket')) {
            const button = new Discord.MessageButton()
            .setLabel(`Claim`)
            .setCustomId("claim")
            .setStyle('PRIMARY')
            const row = new Discord.MessageActionRow()
            .addComponents(button)
            await setTimeout( () => {
                channel.send({ components: [row]})
            }, 1500)
          }
});  

client.on('interactionCreate', async interaction => {
if (interaction.isButton()) {
  interaction.deferUpdate();
  if (interaction.customId === "claim") {
  interaction.message.delete().catch(() => null); 
   if (!interaction.member.roles.cache.has(staffrole)) {
      return;
    }
     const tch = interaction.channel;
  const claimer = interaction.user;
  const lockrolefromstaff = staffrole;

  tch.permissionOverwrites.edit(claimer, { SEND_MESSAGES: true });
  tch.permissionOverwrites.edit(lockrolefromstaff, { SEND_MESSAGES: false });
    const Embed = new Discord.MessageEmbed()
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("GREEN")
      .setTitle(`Claimed Ticket!`)
      .setDescription(`**Your ticket will be handled by ${interaction.user}**`)
      .setTimestamp()
      .setFooter(interaction.guild.name, interaction.guild.iconURL());

    await interaction.channel.send({
      embeds: [Embed]

    });

      db.add(`points_${interaction.user.id}`, 1)
        const uid = interaction.user.id;
  const userq = db.get(`quests_${uid}`) || [];
  
  userq.forEach(userquest => {
    if (userquest.type === 'ticket' && !userquest.completed) {
      userquest.progress += 1;

      if (userquest.progress >= userquest.goal) {
        userquest.progress = userquest.goal;
        userquest.completed = true;

        const reward = userquest.reward || 1;
        db.add(`points_${uid}`, reward);
    
      }
    }
  });
  
  db.set(`quests_${uid}`, userq);
    
  }
}

});
let owner=["789949898808229908"]
client.login(process.env.token);