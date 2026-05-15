import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const CreateTripDetail=mutation({
    args:{
        tripId:v.string(),
        uid:v.id('UserTable'),
        tripDetail:v.any(),
    },
    handler:async(ctx,args)=>{
        const {tripId,uid,tripDetail}=args;
        const result=await ctx.db.insert("TripDetailTable",{
            tripId,
            tripDetail,
            uod:uid,
        })
    }

}
)