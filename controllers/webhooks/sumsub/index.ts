import { NextFunction, Request, Response } from "express";
import sumsubClient from "../../../configs/sumsubClient";

const logPrefix = "WEBHOOK:SUMSUB:CONTROLLER";

// Placeholder: implement this function to update your user database
async function markUserAsVerified(
  externalUserId: string,
  reviewStatus: string,
  applicantInfo: any,
  applicantReport: any
) {
  console.log("Updating DB for user:", externalUserId);
  console.log("Review status:", reviewStatus);
  console.log("Applicant info:", applicantInfo);
  console.log("Applicant report:", applicantReport);
  // TODO: save to your database
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`${logPrefix} webhook received:`, JSON.stringify(req.body));

    const webhookEvent = req.body;

    if (webhookEvent.type === "applicantWorkflowCompleted") {
      const applicantId = webhookEvent.data.applicantId;
      const externalUserId = webhookEvent.data.externalUserId;
      const reviewStatus = webhookEvent.data.reviewStatus; // GREEN, RED, PENDING

      console.log("KYC completed for applicant:", applicantId, "status:", reviewStatus);

      // 1️⃣ Fetch full applicant info
      const infoResponse = await sumsubClient.get(`/resources/applicants/${applicantId}/info`);
      const applicantInfo = infoResponse.data;
      console.log(`${logPrefix} applicant info:`, JSON.stringify(applicantInfo));

      // 2️⃣ Fetch applicant verification report
      const reportResponse = await sumsubClient.get(`/resources/applicants/${applicantId}/reports`);
      const applicantReport = reportResponse.data;
      console.log(`${logPrefix} applicant report:`, JSON.stringify(applicantReport));

      // 3️⃣ Update your database
      await markUserAsVerified(externalUserId, reviewStatus, applicantInfo, applicantReport);
    }

    return res.status(200).json({
      status: "success",
      message: "Webhook processed successfully",
    });
  } catch (error: any) {
    console.error(`${logPrefix} error:`, error);
    next(error);
  }
};
