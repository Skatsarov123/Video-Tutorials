const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
    },
    description: {
        type: String,
        required: true,
        maxlength: 20,
    },
    imageUrl: {
        type: String,
        required: true,
        validate: /^https?:\/\//i
    },
    isPublic: {
    type: Boolean,
    required:true,
    default: false,

},
    createdAt: {
    type: String,
    required: true,
    
},
    users: [
    {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
],
    owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
}
}, {
    timestamps: true
});
courseSchema.method('getUsers', function(){
    return this.users.map(x => x.name).join(', ');
});
const Course = mongoose.model('Course', courseSchema);

module.exports = Course