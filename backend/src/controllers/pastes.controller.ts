    import { NextFunction, Request, Response } from "express";
    import { nowMs } from "../lib/time";
    import { nanoid } from "nanoid";
    import { redis } from "../lib/redis";



    export const createPaste = async (req: Request, res: Response,next:NextFunction) => {
        try {
            const { content, ttl_seconds, max_views } = req.body;
        
        console.log(req.body);
        
        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({ error: "Invalid content" });
        }
        if (ttl_seconds && ttl_seconds < 1) {
            return res.status(400).json({ error: "Invalid ttl" });
        }
        if (max_views && max_views < 1) {
            return res.status(400).json({ error: "Invalid max_views" });
        }
        
        const id = nanoid(10);
        const now = nowMs(req);
        
        const paste = {
            content,
            remaining_views: max_views ?? null,
            expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
        };
        
        const key = `paste:${id}`;
        
        if (ttl_seconds) {
            await redis.set(key, paste, { px: ttl_seconds * 1000 });
        } else {
            await redis.set(key, paste);
        }
        
        return res.status(201).json({
            id,
            url: `${process.env.BASE_URL}/p/${id}`,
    
        });
        } catch (error) {
            console.log(error);
            next(error)
            
        }
    }



    export const getPastes=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const key = `paste:${req.params.id}`;
    const paste = await redis.get<any>(key);

    if (!paste) {
        return res.status(404).json({ error: "Not found" });
    }

    const now = nowMs(req);

    if (paste.expires_at && now >= paste.expires_at) {
        await redis.del(key);
        return res.status(404).json({ error: "Expired" });
    }

 if (paste.remaining_views !== null) {
  if (paste.remaining_views <= 0) return res.status(404).json({ error: "No views left" });
  await redis.hincrby(key, "remaining_views", -1);
  paste.remaining_views -= 1;
}


    return res.status(200).json({
        content: paste.content,
        remaining_views: paste.remaining_views,
        expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    });
    } catch (error) {
        console.log(error);
        next(error) 
        
    }
    }