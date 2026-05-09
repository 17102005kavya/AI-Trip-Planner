import {v} from "convex/values";
import { mutation } from "./_generated/server";

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
          return result;
        }
        return user[0];
       
    }});