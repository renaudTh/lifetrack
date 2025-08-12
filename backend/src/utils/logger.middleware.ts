

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {

    private logger = new Logger('HTTP');

    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {

        const { method, url } = req;
        const userAgent = req.headers['user-agent'] || '';

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.getHeader("Content-Length")
            this.logger.log(
                `${method} ${url} ${statusCode} ${contentLength} - ${userAgent}`,
            );
        })
        next();
    }
}