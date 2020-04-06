const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');

const {check, validationResult} = require('express-validator');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const User = require('../../models/User');


// GET API Current User Profile



router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST API Create/ Update Current User Profile

router.post('/', [auth, [
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty()
]
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        medium,
        facebook,
        twitter,
        instagram,
        linkedin,
        github            
    } = req.body;

    const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website === '' ? '' : normalize(website, { forceHttps: true }),
        bio,
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
      };

    //Social object

    profileFields.social = {}
    if(medium) profileFields.social.medium = medium;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(github) profileFields.social.github = github;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        if(profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields },
                {new: true}
                );
                return res.json(profile);
        }

        //create

        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//GET All profile Public route

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//GET   Public profile  by /api/profile/user/:user_id

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) res.status(400).json({msg: 'Profile not found'});
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});

//DELETE  profile, User, Post 

router.delete('/', auth, async (req, res) => {
    try {
        //Remove profile
        await Profile.findOneAndRemove({user: req.params.user_id});
        //
        await User.findOneAndRemove({_id: req.params.user_id});
        res.json({msg: 'User Deleted'});
    } catch (err) {
        console.error(err.message);
        if(err.name == 'CastError'){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;