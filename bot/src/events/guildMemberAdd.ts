import {
  Events,
  EmbedBuilder,
  GuildMember,
  TextChannel,
} from "discord.js";

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const channelId = "1487261871361757184";
    const channel = member.guild.channels.cache.get(channelId) as TextChannel;

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("New User Joined")
      .setDescription(`${member}`)
      .setColor(0x00ff00)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
