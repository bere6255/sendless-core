"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kucoinClient_1 = __importDefault(require("../../../configs/kucoinClient"));
const model_submit_kyc_req_1 = require("kucoin-universal-sdk/dist/generate/broker/ndbroker/model_submit_kyc_req");
// import { createApplicant } from '../../../helpers/createApplicant';
// import { uploadDocument } from '../../../helpers/uploadJpgDocument';
const logPrefix = "[ASSETS:GET:CONTROLLER]";
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = (0, kucoinClient_1.default)();
        const kycReq = {
            clientUid: "226383154",
            firstName: "Kaylah",
            lastName: "Padberg",
            issueCountry: "JP",
            birthDate: "2000-01-01",
            expireDate: "2025-01-01",
            identityType: model_submit_kyc_req_1.SubmitKYCReq.IdentityTypeEnum.PASSPORT,
            identityNumber: "55",
            facePhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWI",
            frontPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQ....",
            backendPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQ....",
            toJson: function () {
                return "";
            }
        };
        // const accountApi = client.restService().getAccountService().getAccountApi().getAccountInfo();
        // const accountApi = client.restService().getBrokerService().getNDBrokerApi().submitKYC(kycReq);
        // const accountApi = client.restService().getBrokerService().getAPIBrokerApi().getRebase({
        // 	begin: '20240610',
        // 	end: '20241010',
        // 	toJson: function (): string {
        // 		return ""
        // 	}
        // });
        /**
         * getRebase
         * Get Broker Rebate
         * /api/v1/broker/api/rebase/download
         */
        // let builder: GetRebaseReqBuilder = GetRebaseReq.builder();
        // builder.setBegin('20240610').setEnd('20241010').setTradeType(GetRebaseReq.TradeTypeEnum._1);
        // let req = builder.build();
        // let resp: Promise<GetRebaseResp> = client.restService().getBrokerService().getNDBrokerApi().getRebase(req);
        const accountApi = client.restService().getAccountService().getAccountApi();
        accountApi.getAccountInfo().then((info) => {
            console.log(info);
            return res.status(200).send(info);
        }).catch((err) => {
            console.log(err);
            return res.status(200).send(err);
        });
        // accountApi.then((info) => {
        // 	console.log(info);
        // 	return res.status(200).send(info)
        // }).catch((err) => {
        // 	console.log(err.err.message);
        // 	res.status(400).send(err)
        // })
        // const applicant = await createApplicant({
        // 	externalUserId: `kocoin_${Date.now()}`,
        // 	info: {
        // 		firstName: 'John',
        // 		lastName: 'Doe',
        // 		dob: '1990-01-01',
        // 		country: 'NGA'
        // 	}
        // });
        // console.log(applicant);
        // const applicantId = applicant.id;
        // await uploadDocument({
        // 	applicantId,
        // 	filePath: './passport.jpg',
        // 	docType: 'PASSPORT',
        // 	country: 'NGA'
        // });
        // await uploadDocument({
        // 	applicantId,
        // 	filePath: './license-front.jpg',
        // 	docType: 'DRIVERS',
        // 	country: 'NGA',
        // 	docSide: 'FRONT'
        // });
        // await uploadDocument({
        // 	applicantId,
        // 	filePath: './license-back.jpg',
        // 	docType: 'DRIVERS',
        // 	country: 'NGA',
        // 	docSide: 'BACK'
        // });
        // const infoRes = await info();
        // 		const {
        //   axiosInstance,
        //   createApplicant,
        //   getApplicantStatus
        // } = require('./sumsubClient'); // adjust filename
        // (async () => {
        //   const response = await axiosInstance(createApplicant('user123', 'basic-kyc-level'));
        //   console.log(response.data);
        // })();
    }
    catch (error) {
        console.log(error);
        error.logPrefix = logPrefix;
        // next(error);
        return res.status(500).send({
            status: "success",
            data: {},
            message: "successful",
        });
    }
});
//# sourceMappingURL=index.js.map