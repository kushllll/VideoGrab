import { z } from "zod";

export const videoFormats = ["mp4", "webm", "mp3"] as const;
export const videoQualities = ["1080p", "720p", "480p", "360p"] as const;

export type VideoFormat = typeof videoFormats[number];
export type VideoQuality = typeof videoQualities[number];

export const videoInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  duration: z.string(),
  channel: z.string(),
  platform: z.string(),
  availableFormats: z.array(z.enum(videoFormats)),
  availableQualities: z.array(z.enum(videoQualities)),
});

export type VideoInfo = z.infer<typeof videoInfoSchema>;

export const downloadRequestSchema = z.object({
  url: z.string().url(),
  format: z.enum(videoFormats),
  quality: z.enum(videoQualities),
});

export type DownloadRequest = z.infer<typeof downloadRequestSchema>;

export const downloadProgressSchema = z.object({
  id: z.string(),
  status: z.enum(["preparing", "downloading", "processing", "complete", "error"]),
  progress: z.number().min(0).max(100),
  message: z.string().optional(),
  downloadUrl: z.string().optional(),
  fileSize: z.string().optional(),
});

export type DownloadProgress = z.infer<typeof downloadProgressSchema>;

export const parseUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type ParseUrlRequest = z.infer<typeof parseUrlSchema>;
