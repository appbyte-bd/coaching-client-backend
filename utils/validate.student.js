export const validateStudent = (student) => {
    const { name, id, className, batch, course, guardianName, guardianNumber, monthlyFee, courseFee, password } = student;

    if (!name || !id || !className || (!batch && !course) || !guardianName || !guardianNumber || (!monthlyFee && !courseFee) || !password) {
        return false;
    }
    return true;
}

