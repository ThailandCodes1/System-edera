const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg');

module.exports = {
  name: 'راتبي',
  description: 'راتب الادارة اليومي',
  run: async (client, interaction, db) => {
    let staffRoleId = db.get(`staffrole`);

       if (!interaction.member.roles.cache.has(staffRoleId)) {
      return interaction.reply({content: `**انت لست اداري**`, ephemeral: true});
    }

const dcd = 24 * 60 * 60 * 1000;
  let ldaily = db.get(`lastDaily_${interaction.user.id}`) || 0;

    let remain = dcd - (Date.now() - ldaily);

    if (remain > 0) {
      return interaction.reply({
        content: `**You have already claimed your daily reward! You can claim it again in ${Math.floor(remain / 3600000)} hours and ${Math.floor((remain % 3600000) / 60000)} minutes.**`,
        ephemeral: true
      });
    }

    
    // calculate a random amount of points to reward
    let points = Math.floor(Math.random() * 9) + 2;
let embed = new Discord.MessageEmbed()
      .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTitle(`الراتب اليومي`)
      .setColor("BLURPLE")
      .setDescription(`**تهانينا! لقد استلمت علاوة و اخذت ${points} نقطة اليوم!**`);
let embed2 = new Discord.MessageEmbed()
      .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTitle(`الراتب اليومي`)
      .setColor("BLURPLE")
      .setDescription(`**استلمت راتبك اليومي و اخذت\`${points}\` نقطة!**`);

    // 10% chance for bonus
    if (Math.random() < 0.1) {
      points += Math.floor(Math.random() * 6) + 1;
      interaction.reply({
        embeds: [embed]
      });
    } else {
      interaction.reply({
        embeds: [embed2]
      });
    }
    db.add(`points_${interaction.user.id}`, points);
    db.set(`lastDaily_${interaction.user.id}`, Date.now());

  }
}
