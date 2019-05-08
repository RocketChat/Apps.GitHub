import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { AppsGithubApp } from '../AppsGithubApp';
import { getWebhookUrl } from '../lib/helpers/getWebhookUrl';
import { sendNotification } from '../lib/helpers/sendNotification';
import { AppPersistence } from '../lib/persistence';
import { getRepoName, GithubSDK } from '../lib/sdk';

enum Command {
    Connect = 'connect',
    SetToken = 'set-token',
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

            case Command.SetToken:
                await this.processSetTokenCommand(context, read, modify, http, persis);
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

        const persistence = new AppPersistence(persis, read.getPersistenceReader());
        const accessToken = await persistence.getUserAccessToken(context.getSender());

        if (!accessToken) {
            await sendNotification(
                'You haven\'t configured your access key yet. Please run `/github set-token YOUR_ACCESS_TOKEN`',
                read,
                modify,
                context.getSender(),
                context.getRoom(),
            );
            return;
        }

        const sdk = new GithubSDK(http, accessToken);

        try {
            await sdk.createWebhook(repoName, await getWebhookUrl(this.app));
        } catch (err) {
            console.error(err);
            await sendNotification('Error connecting to the repo', read, modify, context.getSender(), context.getRoom());
            return;
        }

        await persistence.connectRepoToRoom(repoName, context.getRoom());

        await sendNotification('Successfully connected repo', read, modify, context.getSender(), context.getRoom());
    }

    private async processSetTokenCommand(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const [, accessToken] = context.getArguments();

        if (!accessToken) {
            await sendNotification('Usage: `/github set-token ACCESS_TOKEN`', read, modify, context.getSender(), context.getRoom());
            return;
        }

        const persistence = new AppPersistence(persis, read.getPersistenceReader());

        await persistence.setUserAccessToken(accessToken, context.getSender());

        await sendNotification('Successfully stored your key', read, modify, context.getSender(), context.getRoom());
    }
}
