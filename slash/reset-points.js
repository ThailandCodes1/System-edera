const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
module.exports = {
  name: 'reset-points',
  description: 'Reset The Points Of All The Staff Or A Specifec User',
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
  db.delete(`points_${u.id}`)
      interaction.reply({content: `**You Have Reseted The Points Of ${u} Successfully :white_check_mark:\n\n ${u.username}'s Points: \`${db.get(`points_${u.id}`) || 0}\`p **`})
  
}
    else {
         let data1 = db.all().map(entry => entry.ID).filter(id => id.startsWith(`points_`))
data1.forEach(db.delete)
  
      interaction.reply({content: `**You Have Reseted The Points Of All Staffs Successfully :white_check_mark:**`})
    }

  }
}
