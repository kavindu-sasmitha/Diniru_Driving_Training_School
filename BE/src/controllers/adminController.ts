import { Request, Response } from "express";
import { User } from "../models/userModel";
import { Student } from "../models/studentModel";
import { ExamResult } from "../models/examResult";
import { calculatePracticalDate } from "../util/dateHelper";
import { Types } from "mongoose";

export const approveStudent = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Student account approved successfully", data: user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Fail to approve student", error: err.message });
  }
};

export const updateExamDate = async (req: Request, res: Response) => {
  const { studentId, examDateStr } = req.body;
  try {
    const examDate = new Date(examDateStr);
    const practicalStartDate = calculatePracticalDate(examDate);

    const queryFilter = Types.ObjectId.isValid(studentId) 
      ? { _id: new Types.ObjectId(studentId) } 
      : { studentId: studentId };

    const student = await Student.findOneAndUpdate(
      queryFilter as any,
      { examDate, practicalStartDate },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.status(200).json({ message: "Exam date and automatic practical schedule updated", data: student });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Fail to update exam schedule", error: err.message });
  }
};

export const searchStudentFullDetails = async (req: Request, res: Response) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ message: "Query string parameter required" });
    }

    let userProfile = await User.findOne({ phoneNumber: query as string });
    let studentProfile = null;

    if (userProfile) {
      studentProfile = await Student.findOne({ userId: userProfile._id });
    } else {
      studentProfile = await Student.findOne({
        $or: [
          { nicNumber: query as string },
          { studentId: query as string }
        ]
      });
      
      if (studentProfile) {
        userProfile = await User.findById(studentProfile.userId);
      }
    }

    if (!studentProfile || !userProfile) {
      return res.status(404).json({ message: "No matching driving school records found" });
    }

    const marksHistory = await ExamResult.find({
      studentId: studentProfile?._id
    } as any)
      .populate("examPaperId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "Student records found",
      userProfile, 
      studentProfile, 
      marksHistory 
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Fail to execute look up query", error: err.message });
  }
};


export const collectStudentPayment = async (req: Request, res: Response) => {
  const { studentId, paidInstallmentNumbers, amountPerInstallment } = req.body;

  
  if (!studentId || !paidInstallmentNumbers || !Array.isArray(paidInstallmentNumbers) || !amountPerInstallment) {
    return res.status(400).json({ 
      message: "studentId, paidInstallmentNumbers (Array), and amountPerInstallment are required fields." 
    });
  }

  try {
    
    const queryFilter = Types.ObjectId.isValid(studentId) 
      ? { _id: new Types.ObjectId(studentId) } 
      : { studentId: studentId };

    const student = await Student.findOne(queryFilter);
    if (!student) {
      return res.status(404).json({ message: "Student record not found." });
    }

    
    paidInstallmentNumbers.forEach((num: any) => {
      const installmentNumber = parseInt(num, 10);
      const installment = student.paymentHistory.find(p => p.installmentNumber === installmentNumber);
      
      if (installment && installment.status !== "COMPLETED") {
        installment.status = "COMPLETED";
        installment.amount = parseFloat(amountPerInstallment);
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

   
    const updatedStudent = await student.save();

    res.status(200).json({ 
      message: updatedStudent.paymentStatus === "COMPLETED" 
        ? "Full Payment Received! Student profile status marked as COMPLETED."
        : `Selected installments ${paidInstallmentNumbers.join(", ")} marked as paid successfully!`, 
      data: updatedStudent 
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to collect payment", error: err.message });
  }
};