import { Router } from "express";
import { 
  approveStudent, 
  updateExamDate, 
  searchStudentFullDetails, 
  collectStudentPayment 
} from "../controllers/adminController";
import { protect, restrictToAdmin } from "../middleware/authMiddleware"; 

const router = Router();


router.use(protect as any);
router.use(restrictToAdmin as any); 


router.post("/approve/:userId", approveStudent);


router.post("/update-exam-date", updateExamDate);


router.get("/search-student", searchStudentFullDetails);


router.post("/collect-payment", collectStudentPayment);

export default router;