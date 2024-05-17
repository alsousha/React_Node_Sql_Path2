import express from 'express';
import {
	createPost,
	editPost,
	getPosts,
	deletePost
} from '../controllers/user.js'

const router = express.Router();
router.get('/posts', getPosts);
router.post('/createpost', createPost);
router.post('/updatepost/:id', editPost);
router.delete('/deletepost/:id', deletePost);
export default router;