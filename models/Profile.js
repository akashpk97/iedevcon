const mongoose = require('mongoose');
 
const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [
        {
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        },
    }],
    education: [
        {
        school: {
            type: String,
        },
        degree: {
            type: String,
        },
        fieldofstudy: {
            type: String,
        },
        from: {
            type: String,
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        }
    }],
    social: {
        medium: {
          type: String
        },
        twitter: {
          type: String
        },
        facebook: {
          type: String
        },
        linkedin: {
          type: String
        },
        instagram: {
          type: String
        },
        github: {
            type: String
        }
      },
    date: {
        type: Date,
        default: Date.now
    }
});
 
module.exports = Profile = mongoose.model('profile', ProfileSchema)