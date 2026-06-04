import { mutation, query } from "./_generated/server";
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
            uid:uid,
        })
    return result;
    }
  
});

export const GetTripDetail=query({
  args:{
    tripId:v.string()
  },
  handler:async(ctx,args)=>{
    const result=await ctx.db.query("TripDetailTable")
      .filter(q=>q.eq(q.field("tripId"),args.tripId))
      .first();
    return result;
  }
});