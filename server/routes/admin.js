const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // user model
const bcrypt = require('bcrypt'); // encrypt and decrypt passwords
const jwt = require('jsonwebtoken'); // crating secure login tokens

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


// Middleware for protected routes
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.render('admin/login', { error: 'Unauthorized. Please log in.', layout: adminLayout });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.render('admin/login', { error: 'Session expired. Please log in again.', layout: adminLayout });
  }
}


// Admin route
//    Admin + Login page
router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Online Diary of Starshine!"
    }
    res.render('admin/login', { 
      locals, 
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});



// Checking login form
router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // check if the username is available

    if (!user) { // if we dont get user details
      return res.render('admin/login', { error: 'Invalid credentials.', layout: adminLayout });
    }

    const isPWValid = await bcrypt.compare(password, user.password);

    if (!isPWValid) { // if invalid
      return res.render('admin/login', { error: 'Invalid credentials.', layout: adminLayout });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');


  } catch (error) {
    console.log(error);
  }
});


// Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => { // protected dashboard | authMiddleware = not permit everyone

  try {
    const locals = {
      title: "Dashboard",
      description: "Online Diary of Starshine!"
    }

    const data = await Post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});


// Create new post
router.get('/add-post', authMiddleware, async (req, res) => {

  try {
    const locals = {
      title: "Add Post",
      description: "Online Diary of Starshine!"
    }

    const data = await Post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout 
    });
  } catch (error) {
    console.log(error);
  }
});


// Handling Post Submission
router.post('/add-post', authMiddleware, async (req, res) => {

  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body
      });
      await Post.create(newPost);

      res.redirect('/dashboard');

    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});


// Edit Post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Online Diary of Starshine!"
    }

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
});



// Update
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body
    });

    res.redirect(`/edit-post/${req.params.id}`); // redirect to the same page once updated

  } catch (error) {
    console.log(error);
  }
});


// Delete
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error)
  }

});


// Admin Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // remove the token to log out
  res.redirect('/');
});


// Register route
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body; // retrieving data from register form
//     const hashedPW = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password: hashedPW });
//       res.status(201).json({ message: 'User Created', user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: 'User already in use' });
//       }
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
module.exports = router;