import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { CustomConfig } from './types/index';

export default class FleetbaseExtensionsMiddlewarePlugin implements IPluginMiddleware<CustomConfig> {
    public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {}

    public register_middlewares(app: Application, auth: IBasicAuth<CustomConfig>, storage: IStorageManager<CustomConfig>): void {
        const router = Router();
        router.get('/list', (req: Request, res: Response & { report_error?: Function }, next: NextFunction): void => {
            storage.getLocalDatabase((err, packages) => {
                if (err) {
                    return next(err);
                }

                res.json(packages);
            });
        });

        router.get('/search', (req: Request, res: Response & { report_error?: Function }, next: NextFunction): void => {
            const keyword = req.query.q as string;
            const stream = storage.search(keyword, {});
            const packages: any[] = [];

            stream.on('data', (data) => {
                // Process each chunk of data
                packages.push(data);
            });

            stream.on('error', (err) => {
                // Handle any errors during streaming
                next(err);
            });

            stream.on('end', () => {
                // All data has been received
                res.json(packages);
            });
        });

        app.use('/-/flb/extensions', router);
    }
}
