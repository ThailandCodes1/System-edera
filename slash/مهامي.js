const Discord = require('discord.js');
const db = require('quick.db');
const client = new Discord.Client({intents: 7753})
module.exports = {
  name: 'مهامي',
  description: 'عرض واستكمال المهام لكسب النقاط.',
 run: async (client, interaction, db) => {
   let role = db.get(`staffrole`)
    if (!interaction.member.roles.cache.has(role)) {
      return interaction.reply({content: `**انت لست اداري**`, ephemeral: true});
    }
   
  const userId = interaction.user.id;
  const userPoints = db.get(`points_${userId}`) || 0;
  const userQuests = db.get(`quests_${userId}`) || [];

    const msgq = userQuests.filter((quest) => quest.type === 'message');
  const msgquests = msgq[0];
  const tktqs = userQuests.filter((quest) => quest.type === 'ticket');
  const tktquests = tktqs[0];
  const embed = new Discord.MessageEmbed()
    .setDescription('هذه مهامك الحالية:')
    .setColor('#0099ff');

  if (msgquests) {
    const messageProgressPercent = Math.min(100, (msgquests.progress / msgquests.goal) * 100);
    const messageProgressStr = `${msgquests.progress}/${msgquests.goal} (${messageProgressPercent.toFixed(0)}%)`;
    embed.addField(`1 - ${msgquests.completed ? ':white_check_mark:' : ':x:'} ${msgquests.name}`, `**التقدم:** ${messageProgressStr}\n**المكافأة:** ${msgquests.reward} نقاط`);
  } else {
    embed.addField('ليس لديك مهمة رسائل في الوقت الحالي', '\u200b');
  }


if (tktquests) {
  const gid = interaction.guild.id;
  
      const ff = `${tktquests.progress}/${tktquests.goal}`;
embed.addField(`2 - ${tktquests.completed ? ':white_check_mark:' : ':x:'} ${tktquests.name}`, `**التقدم:** ${ff}\n**المكافأة:** ${tktquests.reward} نقاط`);
} else {
  embed.addField('ليس لديك مهمة تكت في الوقت الحالي', '\u200b');
}

interaction.reply({ embeds: [embed] });


 }
}

