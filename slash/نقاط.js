const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
module.exports = {
  name: 'نقاط',
  description: 'لعرض نقاطك او نقاط شخص',
  options: [
    {
      name: `user`,
      description: 'لشخص محدد',
      type: 'USER',
      required: false
    }
  ],
  run: async (client, interaction, db) => {
  

    let user = interaction.options.getUser("user") || interaction.user;
    let points = db.get(`points_${user.id}`) || 0;
let staffRoleId = db.get(`staffrole`);

if (staffRoleId && interaction.guild && user.id !== interaction.user.id) {
  let member = interaction.guild.members.cache.get(user.id);
  if (!member || !member.roles.cache.has(staffRoleId)) {
    return interaction.reply({content: `**هذا ليس أداريًا**`, ephemeral: true});
  }
}
    let embed = new Discord.MessageEmbed()
      .setAuthor(user.username, user.avatarURL({ dynamic: true }))
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTitle(`نقاط الادارة`)
      .setColor("BLURPLE")
      .setDescription(`** ${
        user.id === interaction.user.id ? 'نقاطك' : ` نقاط${user.username}`
      } : \`${points}\` **`)
      .setFooter(`Requested By ${interaction.user.tag}`, interaction.user.avatarURL({ dynamic: true }));

    interaction.reply({
      embeds: [embed]
    });
  }
}
