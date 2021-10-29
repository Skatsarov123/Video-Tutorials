const Course = require('../models/course');

exports.getAll = () => Course.find().lean();

exports.create = (courseData) => Course.create(courseData);

exports.getOne = (courseId) => Course.findById(courseId).populate('users');

exports.addUser = (courseId, userId) =>
    // let housing = await housingService.getOne(req.params.housingId);
    // housing.tenants.push(req.user._id)
    // return housing.save();

    Course.findOneAndUpdate(
        { _id: courseId },
        {
            $push: { users: userId },
          
        },
        { runValidators: true }
    );
exports.getAllPublic = (courseId) => Course.find({isPublic:true }).lean();

exports.delete = (courseId) => Course.findByIdAndDelete(courseId);

exports.findMy =(userId) =>Course.findById(userId).populate('users');

exports.updateOne = (courseId, courseData) => Course.findByIdAndUpdate(courseId, courseData);



