const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
