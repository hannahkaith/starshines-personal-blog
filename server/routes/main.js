// Handles the main site routes
const express = require('express'); // import express library
const router = express.Router(); // handles and sends routes
const Post = require('../models/Post');


// Routes
//    Home route
//    presenting older posts (5 at a time)
router.get('', async (req, res) => { // async > waits for data

  try {
    const locals = {
      title: "Starshine's Blog",
      description: "Online Diary of Starshine!"
    }

    let perPage = 5; // displaying 5 blog posts at a time
    let page = req.query.page || 1; // Retrieves page number from URL | Else, it will be set to 1 and present the FIRST 5!

    // Retrieves posts from MongoDB
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]) // sorting the results by the date (latest - oldest)
      .skip(perPage * page - perPage) // when on other page, presents the next posts
      .limit(perPage)
      .exec(); // executes line

    // How many blog posts are present > display button
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1; // current page + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { //renders the homepage
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null // ? checking if there's a next page -> set the number or null
    });

  } catch (error) {
    console.log(error);
  }
});



//    Get route
//    post : id
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id; // retrieves the unique Id

    const data = await Post.findById({ _id: slug }); // query the database with this Id

    const locals = {
      title: data.title,
      // description: "Online Diary of Starshine!"
    }

    res.render('post', { 
      locals, 
      data
    }); // creates a page
  } catch (error) {
    console.log(error);
  }
});



//    Post route
router.post('/search', async (req, res) => { 
  try {
    const locals = {
      title: "Search",
      description: "Online Diary of Starshine!"
    }

    let searchTerm = req.body.searchTerm; // retrieves the search input
    const searchNoSpecialC = searchTerm.replace(/[^a-zA-Z0-9]/g, "") // removes any special characters

    const data = await Post.find({ // looks through database for the matching term to the input
      $or: [ // either title or body of post
        { title: { $regex: new RegExp(searchNoSpecialC, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialC, 'i') } }
      ]
    });

    res.render("search", { // renders search page
     data,
     locals 
    });


  } catch (error) {
    console.log(error);
  }
});


//    About route
router.get('/about', (req, res) => {
  res.render('about');
});

//    Socials route
router.get('/socials', (req, res) => {
  res.render('socials');
});

module.exports = router;