import type { Express } from "express";
import { createServer, type Server } from "http";
import { parseUrlSchema, downloadRequestSchema, type VideoInfo, type DownloadProgress } from "@shared/schema";
import { randomUUID } from "crypto";

const sampleVideos: Record<string, VideoInfo> = {
  youtube: {
    id: randomUUID(),
    title: "Amazing Nature Documentary - 4K Ultra HD",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop",
    duration: "12:45",
    channel: "Nature Channel",
    platform: "YouTube",
    availableFormats: ["mp4", "webm", "mp3"],
    availableQualities: ["1080p", "720p", "480p", "360p"],
  },
  vimeo: {
    id: randomUUID(),
    title: "Cinematic Travel Vlog - Europe 2024",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=640&h=360&fit=crop",
    duration: "8:32",
    channel: "TravelWithMe",
    platform: "Vimeo",
    availableFormats: ["mp4", "webm", "mp3"],
    availableQualities: ["1080p", "720p", "480p", "360p"],
  },
  dailymotion: {
    id: randomUUID(),
    title: "How to Cook Perfect Pasta - Chef's Guide",
    thumbnail: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=640&h=360&fit=crop",
    duration: "15:20",
    channel: "CookingMaster",
    platform: "Dailymotion",
    availableFormats: ["mp4", "webm", "mp3"],
    availableQualities: ["1080p", "720p", "480p"],
  },
  facebook: {
    id: randomUUID(),
    title: "Tech Review: Latest Smartphone Comparison",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=360&fit=crop",
    duration: "22:15",
    channel: "TechReviewer",
    platform: "Facebook",
    availableFormats: ["mp4", "mp3"],
    availableQualities: ["720p", "480p", "360p"],
  },
  twitter: {
    id: randomUUID(),
    title: "Breaking News: Space Launch Success",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=640&h=360&fit=crop",
    duration: "3:45",
    channel: "SpaceNews",
    platform: "Twitter",
    availableFormats: ["mp4", "mp3"],
    availableQualities: ["720p", "480p"],
  },
};

function detectPlatform(url: string): string | null {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    return "youtube";
  }
  if (urlLower.includes("vimeo.com")) {
    return "vimeo";
  }
  if (urlLower.includes("dailymotion.com") || urlLower.includes("dai.ly")) {
    return "dailymotion";
  }
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.watch")) {
    return "facebook";
  }
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) {
    return "twitter";
  }
  return null;
}

const downloads = new Map<string, DownloadProgress>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/parse-url", async (req, res) => {
    try {
      const result = parseUrlSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid URL format",
          details: result.error.issues 
        });
      }

      const { url } = result.data;
      const platform = detectPlatform(url);
      
      if (!platform) {
        return res.status(400).json({ 
          error: "Unsupported platform. We support YouTube, Vimeo, Dailymotion, Facebook, and Twitter." 
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const videoInfo = sampleVideos[platform];
      if (!videoInfo) {
        return res.status(404).json({ error: "Video not found" });
      }

      res.json({
        ...videoInfo,
        id: randomUUID(),
      });
    } catch (error) {
      console.error("Error parsing URL:", error);
      res.status(500).json({ error: "Failed to parse video URL" });
    }
  });

  app.post("/api/download", async (req, res) => {
    try {
      const result = downloadRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid download request",
          details: result.error.issues 
        });
      }

      const downloadId = randomUUID();
      
      downloads.set(downloadId, {
        id: downloadId,
        status: "preparing",
        progress: 0,
        message: "Preparing download...",
      });

      res.json({ downloadId });
    } catch (error) {
      console.error("Error starting download:", error);
      res.status(500).json({ error: "Failed to start download" });
    }
  });

  app.get("/api/download/:id/status", async (req, res) => {
    const { id } = req.params;
    const download = downloads.get(id);
    
    if (!download) {
      return res.status(404).json({ error: "Download not found" });
    }
    
    res.json(download);
  });

  return httpServer;
}
