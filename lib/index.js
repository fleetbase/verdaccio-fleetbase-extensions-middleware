"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verdaccio_fleetbase_s3_storage_1 = __importDefault(require("@fleetbase/verdaccio-fleetbase-s3-storage"));
class FleetbaseExtensionsMiddleware {
    logger;
    s3Storage;
    constructor(config, options) {
        this.logger = options.logger;
        this.s3Storage = new verdaccio_fleetbase_s3_storage_1.default(config, {
            ...options,
            config: { ...config },
        });
    }
    register_middlewares(app, auth, storage) {
        const router = (0, express_1.Router)();
        router.get('/', async (req, res, next) => {
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
            }
            catch (error) {
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
exports.default = FleetbaseExtensionsMiddleware;
