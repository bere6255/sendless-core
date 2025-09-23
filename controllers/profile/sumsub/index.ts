import { NextFunction, Request, Response } from "express";
import { log } from "console";
import sumsubClient from "../../../configs/sumsubClient";
import { createApplicant } from "../../../thirdparty/sumsub/createApplicant";

const logPrefix = "PROFILE:SUMSUB:CONTROLLER";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    console.log(`${logPrefix} init ===> user id: ${user.id} `);

    const externalUserId = `sendless_${user.id}`;
    let applicant: any;

    try {
      // Try creating a new applicant
      applicant = await createApplicant({
        externalUserId,
        email: user?.email,
        phone: user?.phone,
        info: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          country: user?.country
        }
      });
      log(`${logPrefix} ✅ Applicant created: ${JSON.stringify(applicant)}`);
    } catch (err: any) {
      // Handle duplicate applicant (409 conflict)
      if (err.response?.status === 409) {
        const description = err.response.data?.description || "";
        const existingApplicantIdMatch = description.match(/([a-f0-9]{24})$/); // extract Sumsub applicantId
        const existingApplicantId = existingApplicantIdMatch ? existingApplicantIdMatch[1] : null;

        log(`${logPrefix} ⚠️ Applicant already exists with externalUserId=${externalUserId}, applicantId=${existingApplicantId}`);

        applicant = { id: existingApplicantId, externalUserId }; // fallback
      } else {
        throw err; // rethrow other errors
      }
    }

    // ✅ Always use externalUserId when generating token
    const resp = await sumsubClient.post(
      `/resources/accessTokens?userId=${externalUserId}&levelName=Sendless`,
      null
    );

    log(`${logPrefix} sumsub response ===> ${JSON.stringify(resp.data)}`);

    return res.status(200).send({
      status: true,
      data: {
        applicantId: applicant?.id,
        externalUserId,
        token: resp.data.token,
      },
      message: "Token generated successfully",
    });

  } catch (error: any) {
    error.logPrefix = logPrefix;
    next(error);
  }
};
