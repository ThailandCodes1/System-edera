const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
const cooldowns = new Map();

module.exports = {
  name: 'شكر',
  description: 'لشكر اداري',
  options: [
    {
      name: `user`,
      description: `الاداري لشكره`,
      type: `USER`,
      required: true
    },
    {
      name: `reason`,
      description: `سبب الشكر`,
      type: `STRING`,
      required: true
    }
  ],
  run: async (client, interaction, db) => {
  let p = interaction.options.getString("reason")
  let u = interaction.options.getUser("user")
     let role = db.get(`staffrole`)
if (role && interaction.guild && u.id !== interaction.user.id) {
  let member = interaction.guild.members.cache.get(u.id);
  if (!member || !member.roles.cache.has(role)) {
    return interaction.reply({content: `**هذا ليس أداريًا**`, ephemeral: true});
  }
}
    if (interaction.member.roles.cache.has(role)) {
      return interaction.reply({content: `**هذا الامر للاعضاء فقط**`, ephemeral: true});
    }
  if (u.id === interaction.user.id) {
    return interaction.reply(`**لا تستطيع شكر نفسك**`)
  }
  

    const now = Date.now();
    const cdamount = 30 * 60 * 1000; 

    const userId = interaction.user.id;
    if (cooldowns.has(userId)) {
      const expiret = cooldowns.get(userId) + cdamount;

      if (now < expiret) {
        const tleft = (expiret - now) / 1000 / 60;
        return interaction.reply({content:`**Please wait ${tleft.toFixed(1)} more minutes before thanking someone again.**`, ephemeral: true});
      }
    }
      db.add(`points_${u.id}`, 1)
    
    interaction.reply({content: `**لقد شكرت ${u}\n لسبب: \`${p}\`\n تم اضافة نقطة ل ${u} :white_check_mark:**`})
  }
}
