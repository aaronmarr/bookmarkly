import Router from '@koa/router';
import { index, create, show, update, destroy } from './controller';
import { validateBookmark } from './middleware';

const router = new Router();

router.get('/', index);
router.post('/', validateBookmark, create);
router.get('/:id', show);
router.put('/:id', validateBookmark, update);
router.del('/:id', destroy);

export default router;
