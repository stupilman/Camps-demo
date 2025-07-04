const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp-second')
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomImageUrl = async () => {
  try {
    const res = await axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
      },
      params: {
        query: 'camping', // 원하는 테마 키워드 (optional)
      },
    });
    return res.data.urls.small;
  } catch (err) {
    console.error('Error fetching image from Unsplash:', err.message);
    return 'https://picsum.photos/800/600'; // 실패 시 fallback
  }
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const image = await getRandomImageUrl();

    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab culpa, dolorum exercitationem hic ipsum libero mollitia, nesciunt nihil placeat unde veritatis voluptatibus! A accusamus aliquam aut enim impedit nesciunt officiis!',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close(); // 이 코드로 인해 실행이 완료하면 자동으로 연결을 종료!
});