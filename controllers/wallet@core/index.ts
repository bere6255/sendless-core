import { Request, Response } from "express"
import procedure from "./procedure"
import { randomNumber } from "../../helpers/util";
// import funding from "../../services/wallet@core/funding";

export default {
    procedure: async (req: Request, res: Response) => await procedure(req, res),
    test: async (req: Request, res: Response) => {

        // const todaysDate = new Date().toISOString().slice(0, 10).replace(/-/g, "")
        // const newReference = `tencoin_funding_${todaysDate}${randomNumber(11)}`;

        // const fundingRes = await funding({
        //     user_id: "6",
        //     peer_user_id: "1",
        //     user_phone:"2348062550673",
        //     meta: null,
        //     provider:"tencoin",
        //     user_email:"clement.bere@gmail.com",
        //     description: "this is a test funding of 25k that will be recalled",
        //     reference: newReference,
        //     amount: 1000,
        //     charge: 0,
        //     type: "funding",
        //     outward: false,
        //     uniqueKey: "13bd2435dw_gcenhjmsfgccc"
        // })
        // console.log(fundingRes)
        
        return res.status(200).send({ status: true, data: {}, message: "successful" })
    }
}
