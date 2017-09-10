const express = require('express');
const httpProxy = require('http-proxy');

const hostName = process.env.DUCK_HOST || 'localhost';

class AdminServer {
  constructor(dsClient, dataManager) {
    this.client = dsClient;
    this.data = dataManager;
    this.webServer = express();
    this.proxy = httpProxy.createServer();
    this.internal = {
      setup: false
    };
  }

  setup() {
    if (this.internal.setup)
      return;

    this.webServer.get('/api/status', (req, res) => {
      let status = {
        connected: this.client.connected,
        presence: this.client.presenceStatus,
        inviteURL: this.client.inviteURL,
        verified: this.client.verified,
        username: this.client.username,
        discriminator: this.client.discriminator,
        bot: this.client.bot,
        id: this.client.id
      };
      res.json(status);
    });

    this.webServer.get('/api/servers', (req, res) => {
      let servers = [];
      for (let id in this.client.servers) {
        let data = {};
        let server = this.client.servers[id];
        data.id = id;
        data.name = server.name;
        data.region = server.region;
        data.ownerId = server.owner_id;
        data.members = [];
        for (let memberId in server.members) {
          let member = server.members[memberId];
          let memberInfo = {};
          memberInfo.id = member.id;
          memberInfo.roles = member.roles;
          memberInfo.nick = member.nick;
          memberInfo.status = member.status;
          data.members.push(memberInfo);
        }
        data.roles = [];
        for (let roleId in server.roles) {
          let role = server.roles[roleId];
          let roleInfo = {};
          roleInfo.id = role.id;
          roleInfo.name = role.name;
          data.roles.push(roleInfo);
        }
        servers.push(data);
      }
      res.json(servers);
    });

    this.webServer.get('/api/channels', (req, res) => {
      let channels = [];
      let serverId = req.query.serverId;
      for (let channelId in this.client.channels) {
        let channel = this.client.channels[channelId];
        if (serverId && serverId != channel.guild_id)
          continue;
        let channelInfo = {};
        channelInfo.id = channel.id;
        channelInfo.serverId = channel.guild_id;
        channelInfo.name = channel.name;
        channelInfo.type = channel.type;
        channels.push(channelInfo);
      }
      res.json(channels);
    });

    this.webServer.get('/api/users', (req, res) => {
      let users = [];
      for (let userId in this.client.users) {
        let user = this.client.users[userId];
        let userInfo = {};
        userInfo.id = user.id;
        userInfo.name = user.username;
        userInfo.discriminator = user.discriminator;
        userInfo.bot = user.bot;
        users.push(userInfo);
      }
      res.json(users);
    });

    this.webServer.get('*', (req, res) => {
      if (req.headers.host === hostName) {
        req.headers.host = 'localhost';
        this.proxy.web(req, res, { target: 'http://loalhost:63423' });
      } else {
        res.status(404).end();
      }
    });

    this.internal.setup = true;
  }

  start() {
    this.setup();
    this.webServer.listen(63422);
  }
}

module.exports = AdminServer;
