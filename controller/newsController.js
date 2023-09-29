import axios from 'axios';
import * as cheerio from 'cheerio';
import { response } from 'express';

const newspapers = [
  {
    name: 'cityam',
    address:
      'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
    base: '',
  },
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
  },
  {
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: '',
  },
  {
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: '',
  },
  {
    name: 'smh',
    address: 'https://www.smh.com.au/environment/climate-change',
    base: 'https://www.smh.com.au',
  },
  {
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: '',
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science_and_environment',
    base: 'https://www.bbc.co.uk',
  },
  {
    name: 'es',
    address: 'https://www.standard.co.uk/topic/climate-change',
    base: 'https://www.standard.co.uk',
  },
  {
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
    base: '',
  },
  {
    name: 'dm',
    address:
      'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: '',
  },
  {
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change/',
    base: '',
  },
];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => console.log(err.message));
});

const articles = [];

/**
 * @desc  Get homepage
 * @route GET /
 * @access Public
 */
const getHomePage = (req, res) => {
  res.json('Welcome to my climate change news api');
};

/**
 * @desc  Get news from multiple sources
 * @route GET /news
 * @access Public
 */
const getAllNews = async (req, res) => {
  res.json(articles);
};

/**
 * @desc  Get news from a particular source
 * @route GET /news/newspaperId
 * @access Public
 */
const getNews = (req, res) => {
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === req.params.newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === req.params.newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cherrio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');

        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: req.params.newspaperId,
        });
      });

      res.json(specificArticles);
    })
    .catch((err) => res.json(err));
};

export { getHomePage, getAllNews, getNews };

/*const getNews = async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.theguardian.com/environment/climate-crisis'
    );
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = 'https://www.theguardian.com' + $(this).attr('href');

      console.log(title, url);
      articles.push({
        title,
        url,
      });
    });
    res.json(articles);
  } catch (error) {
    res.json(error.message);
  }
}; */
