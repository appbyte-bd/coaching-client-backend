import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Course from "../models/course.model.js";
import Student from "../models/student.model.js";
/**
 * @desc    Seeds the Batch collection with initial data
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const seedBatches = async (req, res) => {
    try {
        // 1. Clear the existing batches collection
        await Batch.deleteMany({});
        console.log("Cleared existing batches...");

        // 2. Define the data to be seeded
        const gradeNames = ['five', 'six', 'seven', 'eight', 'nine', 'ten'];

        const batchesToInsert = gradeNames.map(grade => {
            // Generate a random admission fee between 2000 and 3000
            const minAdmissionFee = 2000;
            const maxAdmissionFee = 3000;
            const admissionFee = Math.floor(Math.random() * (maxAdmissionFee - minAdmissionFee + 1)) + minAdmissionFee;

            // Generate a random monthly fee between 500 and 1500
            const minMonthlyFee = 500;
            const maxMonthlyFee = 1500;
            const monthlyFee = Math.floor(Math.random() * (maxMonthlyFee - minMonthlyFee + 1)) + minMonthlyFee;

            return {
                name: grade,
                className: `Class ${grade.charAt(0).toUpperCase() + grade.slice(1)}`, // e.g., "Class Five"
                admissionFee: String(admissionFee), // Schema expects a String
                monthlyFee: String(monthlyFee),     // Schema expects a String
                // The 'time' field is no longer included
            };
        });

        // 3. Insert the new batches into the database
        const createdBatches = await Batch.insertMany(batchesToInsert);
        console.log(`Successfully seeded ${createdBatches.length} batches.`);

        // If used in an API route, send a success response
        if (res) {
            res.status(201).json({
                success: true,
                message: "Batches seeded successfully!",
                count: createdBatches.length,
                data: createdBatches
            });
        }

    } catch (error) {
        console.error("Error seeding batches:", error);
        // If used in an API route, send an error response
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to seed batches.",
                error: error.message
            });
        }
    }
};



/**
 * @desc    Seeds the Course collection with initial data
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const seedCourses = async (req, res) => {
    try {
        // 1. Clear the existing courses collection
        await Course.deleteMany({});
        console.log("Cleared existing courses...");

        // 2. Define the courses to be seeded
        const courseData = [
            { name: "Web Development", className: "Professional", courseFee: "15000", admissionFee: "1000" },
            { name: "Graphic Design", className: "Professional", courseFee: "12000", admissionFee: "1000" },
            { name: "Digital Marketing", className: "Professional", courseFee: "10000", admissionFee: "800" },
            { name: "English Speaking", className: "General", courseFee: "8000", admissionFee: "500" },
            { name: "Computer Basic", className: "General", courseFee: "6000", admissionFee: "500" },
            { name: "MS Office", className: "General", courseFee: "7000", admissionFee: "500" },
            { name: "Programming Fundamentals", className: "Professional", courseFee: "18000", admissionFee: "1500" },
            { name: "IELTS Preparation", className: "Professional", courseFee: "20000", admissionFee: "2000" }
        ];

        // 3. Insert the new courses into the database
        const createdCourses = await Course.insertMany(courseData);
        console.log(`Successfully seeded ${createdCourses.length} courses.`);

        // If used in an API route, send a success response
        if (res) {
            res.status(201).json({
                success: true,
                message: "Courses seeded successfully!",
                count: createdCourses.length,
                data: createdCourses
            });
        }

        return createdCourses;
    } catch (error) {
        console.error("Error seeding courses:", error);
        // If used in an API route, send an error response
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to seed courses.",
                error: error.message
            });
        }
        throw error;
    }
};

/**
 * @desc    Seeds students with references to actual batches and courses from database
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const seedStudents = async (req, res) => {
    try {
        // 1. Fetch all existing batches and courses from database
        const existingBatches = await Batch.find({});
        const existingCourses = await Course.find({});

        // 2. Validate that batches and courses exist
        if (existingBatches.length === 0) {
            const errorMsg = "No batches found in database. Please seed batches first.";
            console.error(errorMsg);
            if (res) {
                return res.status(400).json({
                    success: false,
                    message: errorMsg
                });
            }
            throw new Error(errorMsg);
        }

        if (existingCourses.length === 0) {
            const errorMsg = "No courses found in database. Please seed courses first.";
            console.error(errorMsg);
            if (res) {
                return res.status(400).json({
                    success: false,
                    message: errorMsg
                });
            }
            throw new Error(errorMsg);
        }

        console.log(`Found ${existingBatches.length} batches and ${existingCourses.length} courses in database.`);

        // 3. Clear existing students
        await Student.deleteMany({});
        console.log("Cleared existing students...");

        // 4. Define data for student generation
        const maleFirstNames = ["Mohammad", "Abdul", "Md", "Shah", "Ahmed", "Ali", "Hassan", "Hossain", "Rahman", "Karim", "Rahim", "Rashid", "Nasir", "Farhan", "Arif", "Rafi", "Shakib", "Tamim", "Sabbir", "Mushfiq"];
        const femaleFirstNames = ["Fatima", "Ayesha", "Rashida", "Nasreen", "Sultana", "Begum", "Khadija", "Rahima", "Salma", "Ruma", "Shireen", "Taslima", "Rehana", "Shahnaz", "Farida", "Nazma", "Razia", "Shamima", "Yasmin", "Rubina"];
        const lastNames = ["Rahman", "Ahmed", "Ali", "Khan", "Hossain", "Islam", "Uddin", "Alam", "Chowdhury", "Sheikh", "Miah", "Sarkar", "Das", "Roy", "Begum", "Khatun", "Bibi", "Aktar", "Sultana", "Parvin"];

        // Education system
        const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "HSC 1st Year", "HSC 2nd Year"];
        const statuses = ["Active", "Inactive"];

        // Bangladeshi areas and districts
        const areas = ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur", "Old Dhaka", "Wari", "Ramna", "Tejgaon"];
        const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"];
        const notes = ["ভাল ছাত্র/ছাত্রী", "নিয়মিত উপস্থিত", "পড়াশোনায় মনোযোগী", "অতিরিক্ত কার্যক্রমে সক্রিয়", "উন্নতির প্রয়োজন", "মেধাবী শিক্ষার্থী", "সময়মত ফি প্রদান করে"];

        // 5. Generate students with actual batch/course references
        const count = req?.query?.count ? parseInt(req.query.count) : 100;
        const students = [];
        const usedIds = new Set();

        for (let i = 0; i < count; i++) {
            const isMale = Math.random() > 0.5;
            const firstName = isMale
                ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
                : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            // Guardian name (usually father's name)
            const guardianFirstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
            const guardianLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            // Generate unique student ID
            let studentId;
            do {
                studentId = `STU${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
            } while (usedIds.has(studentId));
            usedIds.add(studentId);

            // Decide if student is in batch or course (50-50 chance)
            const isInBatch = Math.random() > 0.5;

            let studentData = {
                name: `${firstName} ${lastName}`,
                id: studentId,
                password: "123456",
                className: classes[Math.floor(Math.random() * classes.length)],
                guardianName: `${guardianFirstName} ${guardianLastName}`,
                guardianNumber: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(Math.random() * 900000000) + 100000000}`,
                studentNumber: `+880${Math.floor(Math.random() * 2) + 1}${Math.floor(Math.random() * 900000000) + 100000000}`,
                address: `${Math.floor(Math.random() * 999) + 1}, ${areas[Math.floor(Math.random() * areas.length)]}, ${districts[Math.floor(Math.random() * districts.length)]}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                note: notes[Math.floor(Math.random() * notes.length)]
            };

            if (isInBatch) {
                // Student is in a batch - pays monthly
                // Select a random batch from existing batches
                const selectedBatch = existingBatches[Math.floor(Math.random() * existingBatches.length)];
                studentData.batch = selectedBatch.name; // Use the actual batch name from database
                studentData.monthlyFee = selectedBatch.monthlyFee; // Use the batch's monthly fee
                // No course data for batch students
            } else {
                // Student is in a course - pays full amount
                // Select a random course from existing courses
                const selectedCourse = existingCourses[Math.floor(Math.random() * existingCourses.length)];
                studentData.course = selectedCourse.name; // Use the actual course name from database
                studentData.courseFee = selectedCourse.courseFee; // Use the course's fee
                // No batch data for course students
            }

            students.push(studentData);
        }

        // 6. Insert students into database
        const insertedStudents = await Student.insertMany(students);
        console.log(`${insertedStudents.length} জন শিক্ষার্থী সফলভাবে যোগ করা হয়েছে`);

        // Log summary
        const batchStudents = insertedStudents.filter(s => s.batch);
        const courseStudents = insertedStudents.filter(s => s.course);
        console.log(`Batch students (monthly payment): ${batchStudents.length}`);
        console.log(`Course students (full payment): ${courseStudents.length}`);

        // If used in an API route, send a success response
        if (res) {
            res.status(201).json({
                success: true,
                message: "Students seeded successfully!",
                count: insertedStudents.length,
                batchStudents: batchStudents.length,
                courseStudents: courseStudents.length,
                data: insertedStudents
            });
        }

        return insertedStudents;
    } catch (error) {
        console.error("শিক্ষার্থী যোগ করতে সমস্যা হয়েছে", error);
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to seed students.",
                error: error.message
            });
        }
        throw error;
    }
}


/**
 * @desc    Clear all students from database
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const clearStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({});
        console.log(`${result.deletedCount} students deleted successfully`);
        console.log(`${result.deletedCount} জন শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে`);
        
        if (res) {
            res.status(200).json({
                success: true,
                message: "Students cleared successfully!",
                deletedCount: result.deletedCount
            });
        }
        
        return result;
    } catch (error) {
        console.error("Error deleting students", error);
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to clear students.",
                error: error.message
            });
        }
        throw error;
    }
};

/**
 * @desc    Clear all data (batches, courses, students)
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const clearAll = async (req, res) => {
    try {
        const batchResult = await Batch.deleteMany({});
        const courseResult = await Course.deleteMany({});
        const studentResult = await Student.deleteMany({});
        
        console.log(`Cleared ${batchResult.deletedCount} batches`);
        console.log(`Cleared ${courseResult.deletedCount} courses`);
        console.log(`Cleared ${studentResult.deletedCount} students`);
        
        if (res) {
            res.status(200).json({
                success: true,
                message: "All data cleared successfully!",
                deleted: {
                    batches: batchResult.deletedCount,
                    courses: courseResult.deletedCount,
                    students: studentResult.deletedCount
                }
            });
        }
        
        return { batchResult, courseResult, studentResult };
    } catch (error) {
        console.error("Error clearing all data", error);
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to clear all data.",
                error: error.message
            });
        }
        throw error;
    }
};

/**
 * @desc    Seed all data in correct order (batches → courses → students)
 * @access  Public (or restrict as needed, e.g., to admin)
 */
const seedAll = async (req, res) => {
    try {
        console.log("Starting complete database seeding...");
        
        // Seed in correct order to maintain referential integrity
        await seedBatches(null, null);
        await seedCourses(null, null);
        await seedStudents(req, null);
        
        console.log("All data seeded successfully!");
        
        if (res) {
            res.status(201).json({
                success: true,
                message: "All data seeded successfully! (Batches → Courses → Students)"
            });
        }
    } catch (error) {
        console.error("Error seeding all data:", error);
        if (res) {
            res.status(500).json({
                success: false,
                message: "Failed to seed all data.",
                error: error.message
            });
        }
        throw error;
    }
}



// Seed individual collections
router.get("/batch", seedBatches);
router.get("/course", seedCourses);
router.get("/student", seedStudents);

// Clear individual collections
router.get("/clear/student", clearStudents);

// Seed and clear all data
router.get("/all", seedAll);
router.get("/clear/all", clearAll);

export default router;
