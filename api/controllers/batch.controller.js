import { Batch } from '../models/batch.modal.js';
import { Course } from '../models/course.modal.js';

/**
 * @route POST /api/v1/batch/create
 * @desc Create Batch
 * @access private
 */

export const createBatch = async (req, res) => {
    try {
        const { batchname, batchcode, course, time } = req.body;

        if (!batchname || !batchcode || !course || !time) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate that the course exists
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const newBatch = new Batch({ batchname, batchcode, course, time });

        await newBatch.save();

        return res.status(201).json(newBatch);
    } catch (error) {
        console.error('Error creating batch:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route GET /api/v1/batch/all
 * @desc Get All Batch
 * @access private
 */

export const getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find().populate('course', 'coursename city');
        return res.status(200).json(batches);
    } catch (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


/**
 * @route GET /api/v1/batch/:id
 * @desc Get Batch by Id
 * @access private
 */

export const getBatchById = async (req, res) => {
    try {
        const { id } = req.params;

        const batch = await Batch.findById(id).populate('course', 'coursename city');

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        return res.status(200).json(batch);
    } catch (error) {
        console.error('Error fetching batch:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route PUT /api/v1/batch/update/:id
 * @desc Update Batch
 * @access private
 */

export const updateBatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { batchname, batchcode, course, time } = req.body;

        const batch = await Batch.findById(id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Validate that the course exists
        if (course) {
            const existingCourse = await Course.findById(course);
            if (!existingCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
        }

        if (batchname) {
            batch.batchname = batchname;
        }
        if (batchcode) {
            batch.batchcode = batchcode;
        }
        if (course) {
            batch.course = course;
        }
        if (time) {
            batch.time = time;
        }

        await batch.save();

        return res.status(200).json(batch);
    } catch (error) {
        console.error('Error updating batch:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route DELETE /api/v1/batch/delete/:id
 * @desc Delete Batch
 * @access private
 */


export const deleteBatch = async (req, res) => {
    try {
        const { id } = req.params;

        const batch = await Batch.findByIdAndDelete(id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        return res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        console.error('Error deleting batch:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};