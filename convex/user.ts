import {v} from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNewUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),
        imageUrl:v.string()
    },
    handler:async(ctx,args)=>{
        const user=await ctx.db.query('UserTable').filter(q=>q.eq(q.field('email'),args.email)).collect();
        //User already exists
        if(user?.length==0){
          const UserData={
            name:args.name,
            email:args.email,
            imageUrl:args.imageUrl
          }
          const result=await ctx.db.insert('UserTable',UserData);
          return {
            _id: result,
            ...UserData
          };
        }
        return user[0];
       
    }});

export const getUserByEmail = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    return user;
  }
});

export const updateSubscription = mutation({
  args: {
    email: v.string(),
    subscription: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    if (user) {
      await ctx.db.patch(user._id, {
        subscription: args.subscription
      });
      return true;
    }
    return false;
  }
});

export const getUserTripsCountToday = query({
  args: {
    uid: v.id("UserTable")
  },
  handler: async (ctx, args) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const trips = await ctx.db
      .query("TripDetailTable")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.gt(q.field("_creationTime"), oneDayAgo)
        )
      )
      .collect();
    return trips.length;
  }
});