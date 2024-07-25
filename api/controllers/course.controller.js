import { Course } from '../models/course.modal.js';

/**
 * @route POST /api/v1/course/create
 * @desc Create Course
 * @access private
 */

export const createCourse = async (req, res) => {
    try {
        const { coursename, city } = req.body;

        if (!coursename || !city) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newCourse = new Course({ coursename, city });

        await newCourse.save();

        return res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


/**
 * @route GET /api/v1/course/all
 * @desc Get All Courses
 * @access private
 */

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route GET /api/v1/course/:id
 * @desc Get Course by Id
 * @access private
 */

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route PUT /api/v1/course/update/:id
 * @desc Update Course
 * @access private
 */

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { coursename, city } = req.body;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (coursename) {
            course.coursename = coursename;
        }
        if (city) {
            course.city = city;
        }

        await course.save();

        return res.status(200).json(course);
    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route DELETE /api/v1/course/delete/:id
 * @desc Delete Course
 * @access private
 */


export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};