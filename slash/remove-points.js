const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const random = require('random-password-pkg')
module.exports = {
  name: 'remove-points',
  description: 'To Remove Points From A User',
  options: [
    {
      name: `user`,
      description: `user to remove points`,
      type: `USER`,
      required: true
    },
    {
      name: `points`,
      description: `amount of points you want to remove`,
      type: `STRING`,
      required: true
    }
  ],
  run: async (client, interaction, db) => {
     if (!interaction.member.permissions.has(`ADMINSTRATOR`)) {
      return interaction.reply({
        content: `**You Don't Have Perms To Use This Command**`,
        ephemeral: true
      });
    }

  let p = interaction.options.getString("points")
  let u = interaction.options.getUser("user")

  if (isNaN(p)) return interaction.reply({content: `**Please Enter Valid Amount Of Points**`, ephemeral: true});

   let c = db.get(`points_${u.id}`)
    if (p > c) {
      db.set(`points_${u.id}`, 0)
    }
    else {
      db.subtract(`points_${u.id}`, p)
    }
    interaction.reply({content: `**You Have Removed \`${p}\` Points From ${u} Successfully :white_check_mark:\n\n ${u.username}'s Points: \`${db.get(`points_${u.id}`)}\`p **`})
  }
}
