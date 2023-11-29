"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class FleetbaseExtensionsMiddleware {
    logger;
    constructor(config, options) {
        this.logger = options.logger;
    }
    register_middlewares(app, auth, storage) {
        const router = (0, express_1.Router)();
        router.get('/', (req, res, next) => {
            const keyword = req.query.q ? String(req.query.q).toLowerCase() : '';
            storage.getLocalDatabase((err, packages) => {
                if (err) {
                    return next(err);
                }
                let filteredPackages = packages;
                if (keyword) {
                    filteredPackages = packages.filter((pkg) => {
                        const nameMatch = pkg.name.toLowerCase().includes(keyword);
                        const descriptionMatch = pkg.description && pkg.description.toLowerCase().includes(keyword);
                        const keywordsMatch = pkg.keywords && pkg.keywords.some((kw) => kw.toLowerCase().includes(keyword));
                        return nameMatch || descriptionMatch || keywordsMatch;
                    });
                }
                res.json(filteredPackages);
            });
        });
        app.use('/-/flb/extensions', router);
    }
}
exports.default = FleetbaseExtensionsMiddleware;
