import { Logger, IPluginMiddleware, IBasicAuth, IStorageManager, PluginOptions, Config } from '@verdaccio/types';
import { Router, Request, Response, NextFunction, Application } from 'express';
import { CustomConfig } from './types/index';
import S3Database, { S3Config } from '@fleetbase/verdaccio-fleetbase-s3-storage';

export default class FleetbaseExtensionsMiddleware implements IPluginMiddleware<CustomConfig> {
    public logger: Logger;
    private s3Storage: S3Database;

    public constructor(config: CustomConfig, options: PluginOptions<CustomConfig>) {
        this.logger = options.logger;
        this.s3Storage = new S3Database(config, {
            ...options,
            config: { ...config } as S3Config & Config,
        });
    }

    public register_middlewares(app: Application, auth: IBasicAuth<CustomConfig>, storage: IStorageManager<CustomConfig>): void {
        const router = Router();
        router.get('/', async (req: Request, res: Response & { report_error?: Function }, next: NextFunction): Promise<void> => {
            const keyword = req.query.q ? String(req.query.q).toLowerCase() : '';

            try {
                let packages = await this.s3Storage.getAllExtensionJson();

                if (keyword) {
                    packages = packages.filter((pkg) => {
                        const nameMatch = pkg.name.toLowerCase().includes(keyword);
                        const descriptionMatch = pkg.description && pkg.description.toLowerCase().includes(keyword);
                        const keywordsMatch = pkg.keywords && Array.isArray(pkg.keywords) && pkg.keywords.some((kw) => kw.toLowerCase().includes(keyword));

                        return nameMatch || descriptionMatch || keywordsMatch;
                    });
                }
                res.json(packages);
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error({ error: error.message }, 'Error fetching composer.json files');
                    res.status(500).send('Internal Server Error');
                }
            }

            // storage.getLocalDatabase((err, packages) => {
            //     if (err) {
            //         return next(err);
            //     }

            //     let filteredPackages = packages;

            //     if (keyword) {
            //         filteredPackages = packages.filter((pkg) => {
            //             const nameMatch = pkg.name.toLowerCase().includes(keyword);
            //             const descriptionMatch = pkg.description && pkg.description.toLowerCase().includes(keyword);
            //             const keywordsMatch = pkg.keywords && pkg.keywords.some((kw) => kw.toLowerCase().includes(keyword));

            //             return nameMatch || descriptionMatch || keywordsMatch;
            //         });
            //     }

            //     res.json(filteredPackages);
            // });
        });

        app.use('/-/flb/extensions', router);
    }
}
