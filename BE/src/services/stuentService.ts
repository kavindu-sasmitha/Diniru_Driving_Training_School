import { Student } from "../models/studentModel";
import { Types } from "mongoose";

export const studentService = {
  
  collectInstallments: async (studentId: string, paidInstallmentNumbers: number[], amountPerInstallment: number) => {
    
    const queryFilter = Types.ObjectId.isValid(studentId) 
      ? { _id: new Types.ObjectId(studentId) } 
      : { studentId: studentId };

    const student = await Student.findOne(queryFilter);
    if (!student) return null;

  
    paidInstallmentNumbers.forEach((num) => {
      const installment = student.paymentHistory.find(p => p.installmentNumber === num);
      if (installment && installment.status !== "COMPLETED") {
        installment.status = "COMPLETED";
        installment.amount = amountPerInstallment;
        installment.paidDate = new Date();
      }
    });

  
    const completedPaymentsCount = student.paymentHistory.filter(p => p.status === "COMPLETED").length;
    student.paidInstallments = completedPaymentsCount;

  
    if (completedPaymentsCount === 5) {
        student.paymentStatus = "COMPLETED";
    } else if (completedPaymentsCount > 0) {
        student.paymentStatus = "PARTIAL";
    } else {
        student.paymentStatus = "PENDING";
    }

   
    return await student.save();
  }
};