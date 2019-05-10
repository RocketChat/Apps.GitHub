# GitHub Integration for Rocket.Chat

Integrates github with your Rocket.Chat server.

Features:
* **Webhook** - exposes an endpoint that can receive and parse GitHub notifications (only `push` events at this time)
* **Auto-install on Repo** - With the slashcommand `/github connect` the app automatically links your server to the desired repo (you have to configure your github personal access token for that)

When you run the `/github connect` command, only the current channel/private group/discussion will receive notifications from GitHub.

Make sure the user `rocket.cat` is able to send messages in the channel/private group/discussion you want to be notified.

## Coming from the Webinars?

This app has been developed during [our webinars series](https://www.youtube.com/playlist?list=PLee3gqXJQrFWO09wQAcEBuKeXxdOnySE7). You can see how it evolves from example to example by checking the `step-*` branches.

The changes from the latest `step` are likely to be the ones on the `master` branch.

## Development Quick Start

Want to help us improve the app? Great! Make sure you have https://github.com/RocketChat/Rocket.Chat.Apps-cli installed.

`npm install -g @rocket.chat/apps-cli`

Checkout this repo and install the dependencies
```bash
git clone https://github.com/RocketChat/Apps.GitHub
cd Apps.GitHub
npm install
```

And you're ready to make changes!

To test them, deploy your app to a local Rocket.Chat server:

`rc-apps deploy -u RC_USER -p RC_PASSWORD --url=http://localhost:3000`

or to update the installation

`rc-apps deploy -f --update -u RC_USER -p RC_PASSWORD --url=http://localhost:3000`

## Documentation
Here are some links to examples and documentation:
- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)

**The Rocket.Chat Apps-Engine needs help with its documentation** We're participating in the first ever [Google Season of Docs](https://developers.google.com/season-of-docs/)! If you're interested in participating with us, check [this link](https://rocket.chat/docs/contributing/google-season-of-docs-2019/#apps-engine-guides)
