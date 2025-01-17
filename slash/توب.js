const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
const {MessageButton, MessageActionRow, MessageEmbed} = require("discord.js");
module.exports = {
  name: 'توب',
  description: 'لإظهار اعلى اداريين لديهم نقاط',
  run: async (client, interaction, db) => {
   let Balance = db.all().filter(data => data.ID.startsWith(`points`)).sort((a, b) => b.data - a.data);
if (Balance.length === 0) {
  return interaction.reply({content: '**No One In DB Now**', ephemeral: true});
}
    let role = db.get(`staffrole`);

    if (!interaction.member.roles.cache.has(role)) {
      return interaction.reply({content: `**انت لست اداري**`, ephemeral: true});
    }
const PAGE_SIZE = 10;
const numPages = Math.ceil(Balance.length / PAGE_SIZE);
let page = 0;

const embd = () => {
  const leaderboard = Balance.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const lead = leaderboard
    .map((data, index) => {
      const user = client.users.cache.get(data.ID.split('_')[1]);
      const tag = user ? user.tag : 'Unknown User#0000';
      return `** #${page * PAGE_SIZE + index + 1} | <@${data.ID.split('_')[1]}>** | **\`${data.data.toLocaleString()}\`p **\n`;
    })
    .join('');

  const embed = new MessageEmbed()
    .setAuthor(`اعلى اداريين`, client.user.displayAvatarURL({ dynamic: true }))
    .setColor('BLURPLE')
    .setDescription(lead)
    .setFooter(`Page ${page + 1}/${numPages} (${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, Balance.length)} of ${Balance.length}) | ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }));

  return embed;
};


interaction.reply({
  embeds: [embd()],
  components: [
    new MessageActionRow().addComponents(
      new MessageButton().setCustomId('prev').setLabel('⬅️').setStyle('PRIMARY').setDisabled(true),
      new MessageButton().setCustomId('next').setLabel('➡️').setStyle('PRIMARY').setDisabled(numPages <= 1)
    )
  ]
}).then(msg => {
    if (!msg) return;

  const prevButton = msg.components[0].components.find(component => component.customId === 'prev');
  const nextButton = msg.components[0].components.find(component => component.customId === 'next');

  // Update the leaderboard based on the current page
  const startIndex = page * 10;
  const endIndex = Math.min(startIndex + 10, Balance.length);
  var ld = '';
  for (let i = startIndex; i < endIndex; i++) {
    if (Balance[i].data === null) Balance[i].data = '0';
    ld += `** #${i + 1} | <@${Balance[i].ID.split('_')[1]}> | \`${Balance[i].data.toLocaleString()}\`p **\n`;
  }
  embd().setDescription(`${ld}`);

  // Update the message with the new leaderboard and buttons
  msg.edit({ embeds: [embd()], components: [new MessageActionRow().addComponents(
    prevButton.setDisabled(page === 0),
    nextButton.setDisabled(endIndex === Balance.length),
  )]});
  const filter = (i) => ['prev', 'next'].includes(i.customId) && i.user.id === interaction.user.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
    collector.on('collect', interaction => {
    if (interaction.customId === 'prev' && page > 0) {
        interaction.deferUpdate()
      page--;
    } else if (interaction.customId === 'next' && endIndex < Balance.length) {
                interaction.deferUpdate()
      page++;
    }

    // Update the leaderboard based on the new page and update the message again

    ld = '';
    for (var i = startIndex; i < endIndex; i++) {
      if (Balance[i].data === null) Balance[i].data = '0';
      ld += `** #${i + 1} | <@${Balance[i].ID.split('_')[1]}>** **\`${Balance[i].data.toLocaleString()}\`p **\n`;
    }
    embd().setDescription(`${ld}`);
    msg.edit({ embeds: [embd()], components: [new MessageActionRow().addComponents(
      prevButton.setDisabled(page === 0),
      nextButton.setDisabled(endIndex === Balance.length),
    )]});
  });

  collector.on('end', () => {
    // Remove the buttons after the collector times out
    prevButton.setDisabled(true);
    nextButton.setDisabled(true);
    msg.edit({ components: [new MessageActionRow().addComponents(
      prevButton, nextButton,
    )]});
  });
})

  }
}
