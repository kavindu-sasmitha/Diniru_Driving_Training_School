import mongoose, { Document, model, Schema } from "mongoose";

interface IPaymentInstallment {
    installmentNumber: number; 
    amount: number;            
    paidDate: Date | null;     
    status: "PENDING" | "COMPLETED"; 
}

export interface IStudent extends Document {
    userId: mongoose.Types.ObjectId; 
    studentId: string;             
    nicNumber: string;
    address: string;
    qrCodeUrl?: string;            
    paymentStatus: "PENDING" | "PARTIAL" | "COMPLETED"; 
    paidInstallments: number;       
    paymentHistory: IPaymentInstallment[]; 
    assignedInstructor?: mongoose.Types.ObjectId; 
    examDate?: Date;               
    practicalStartDate?: Date;     
}

const studentSchema = new Schema<IStudent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        studentId: { type: String, unique: true }, 
        nicNumber: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        qrCodeUrl: { type: String, default: "" },
        paymentStatus: { 
            type: String, 
            enum: ["PENDING", "PARTIAL", "COMPLETED"], 
            default: "PENDING" 
        },
        paidInstallments: { type: Number, default: 0 }, 
        paymentHistory: {
            type: [
                {
                    installmentNumber: { type: Number, required: true },
                    amount: { type: Number, default: 0 },
                    paidDate: { type: Date, default: null },
                    status: { type: String, enum: ["PENDING", "COMPLETED"], default: "PENDING" }
                }
            ],
            default: [
                { installmentNumber: 1, amount: 0, paidDate: null, status: "PENDING" },
                { installmentNumber: 2, amount: 0, paidDate: null, status: "PENDING" },
                { installmentNumber: 3, amount: 0, paidDate: null, status: "PENDING" },
                { installmentNumber: 4, amount: 0, paidDate: null, status: "PENDING" },
                { installmentNumber: 5, amount: 0, paidDate: null, status: "PENDING" }
            ]
        },
        assignedInstructor: { type: Schema.Types.ObjectId, ref: "User", default: null },
        examDate: { type: Date, default: null },
        practicalStartDate: { type: Date, default: null } 
    },
    { timestamps: true }
);


studentSchema.pre<IStudent>("save", async function () {
    if (this.isNew) {
        try {
            const currentYearShort = new Date().getFullYear().toString().slice(-2);
            const prefix = `DDS${currentYearShort}`;

            const StudentModel = mongoose.model<IStudent>("Student");

            const lastStudent = await StudentModel.findOne({ 
                studentId: new RegExp(`^${prefix}`) 
            })
            .sort({ studentId: -1 })
            .exec();

            let nextNumber = 1;

            if (lastStudent && lastStudent.studentId) {
                const currentSerialNumber = lastStudent.studentId.replace(prefix, "");
                const parsedNumber = parseInt(currentSerialNumber, 10);
                if (!isNaN(parsedNumber)) {
                    nextNumber = parsedNumber + 1;
                }
            }

            const paddedNumber = nextNumber.toString().padStart(4, "0");
            this.studentId = `${prefix}${paddedNumber}`;

        } catch (error) {
            console.error("Error inside student pre-save hook: ", error);
            throw error; 
        }
    }
});

export const Student = model<IStudent>("Student", studentSchema);