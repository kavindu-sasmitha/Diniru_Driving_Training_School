
export const calculatePracticalDate = (examDate: Date): Date => {
    const practicalDate = new Date(examDate);
    practicalDate.setDate(practicalDate.getDate() + 75);
    return practicalDate;
};