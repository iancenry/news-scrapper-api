import express from 'express';
const router = express.Router();
import {
  getHomePage,
  getAllNews,
  getNews,
} from '../controller/newsController.js';

router.get('/', getHomePage);
router.get('/news', getAllNews);
router.get('/news/:newspaperId', getNews);

export { router };
