import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { CustomConfig } from '../types/index';

export default class FleetbaseExtensionsMiddlewarePlugin implements IPluginMiddleware<CustomConfig> {
    public logger: Logger;
    public foo: string;
    public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
        this.foo = config.foo !== undefined ? config.strict_ssl : true;
        this.logger = options.logger;
    }

    public register_middlewares(
        app: Application,
        auth: IBasicAuth<CustomConfig>,
        /* eslint @typescript-eslint/no-unused-vars: off */
        _storage: IStorageManager<CustomConfig>
    ): void {
        // eslint new-cap:off
        const router = Router();
        router.get('/api/extensions', (req: Request, res: Response & { report_error?: Function }, next: NextFunction): void => {
            const query = req.query.q || '';

            storage.get((err, packages) => {
                if (err) {
                    return res.status(500).send('Internal Server Error');
                }

                let filteredExtensions = packages;

                // Implement filtering logic based on the query
                if (query) {
                    filteredExtensions = packages.filter((pkg) => pkg.name.includes(query) || (pkg.description && pkg.description.includes(query)));
                }

                // Transform the filtered packages data
                const extensions = filteredExtensions.map((pkg) => ({
                    name: pkg.name,
                    description: pkg.description,
                    // Include other relevant details
                }));

                res.json(extensions);
            });
            next();
        });

        app.use('/-/flb/extensions', router);
    }
}
