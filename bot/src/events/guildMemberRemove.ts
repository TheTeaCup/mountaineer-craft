import { Events, EmbedBuilder, GuildMember, TextChannel } from "discord.js";

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {
    const channelId = "1487261871361757184";
    const channel = member.guild.channels.cache.get(channelId) as TextChannel;

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("User Left")
      .setDescription(`${member}`)
      .setColor(0xff0000)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};
