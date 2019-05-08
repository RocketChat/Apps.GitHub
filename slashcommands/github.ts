import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { AppsGithubApp } from '../AppsGithubApp';
import { getWebhookUrl } from '../lib/helpers/getWebhookUrl';
import { sendNotification } from '../lib/helpers/sendNotification';
import { AppPersistence } from '../lib/persistence';
import { getRepoName, GithubSDK } from '../lib/sdk';

enum Command {
    Connect = 'connect',
}

export class GithubSlashcommand implements ISlashCommand {
    public command = 'github';
    public i18nParamsExample = 'slashcommand_params';
    public i18nDescription = 'slashcommand_description';
    public providesPreview = false;

    public constructor(private readonly app: AppsGithubApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [command] = context.getArguments();

        switch (command) {
            case Command.Connect:
                await this.processConnectCommand(context, read, modify, http, persis);
                break;
        }
    }

    private async processConnectCommand(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [, repoUrl] = context.getArguments();

        if (!repoUrl) {
            await sendNotification('Usage: `/github connect REPO_URL`', read, modify, context.getSender(), context.getRoom());
            return;
        }

        const repoName = getRepoName(repoUrl);

        if (!repoName) {
            await sendNotification('Invalid GitHub repo address', read, modify, context.getSender(), context.getRoom());
            return;
        }

        const sdk = new GithubSDK(http);

        try {
            await sdk.createWebhook(repoName, await getWebhookUrl(this.app));
        } catch (err) {
            console.error(err);
            await sendNotification('Error connecting to the repo', read, modify, context.getSender(), context.getRoom());
            return;
        }

        await sendNotification('Successfully connected repo', read, modify, context.getSender(), context.getRoom());
    }
}
