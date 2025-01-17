const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
module.exports = {
  name: 'add-points',
  description: 'To Add Points To A User',
  options: [
    {
      name: `user`,
      description: `user to add points`,
      type: `USER`,
      required: true
    },
    {
      name: `points`,
      description: `amount of points you want to add`,
      type: `STRING`,
      required: true
    }
  ],
  run: async (client, interaction, db) => {
   if (!interaction.member.permissions.has(`owner`)) {
      return interaction.reply({
        content: `**You Don't Have Perms To Use This Command**`,
        ephemeral: true
      });
    }

  let p = interaction.options.getString("points")
  let u = interaction.options.getUser("user")

  if (isNaN(p)) return interaction.reply({content: `Please Enter Valid Amount Of Points`, ephemeral: true});

  
      db.add(`points_${u.id}`, p)
    
    interaction.reply({content: `**You Have Added \`${p}\` points To ${u} Successfully :white_check_mark:\n\n ${u.username}'s Points: \`${db.get(`points_${u.id}`)}\`p **`})
  }
}
