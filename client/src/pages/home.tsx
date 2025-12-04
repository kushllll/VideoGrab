import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Download, Link2, Play, Clock, User, Film, Music, Video, Check, AlertCircle, Loader2, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  parseUrlSchema, 
  type ParseUrlRequest, 
  type VideoInfo, 
  type VideoFormat, 
  type VideoQuality,
  type DownloadProgress,
  videoFormats,
  videoQualities
} from "@shared/schema";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <Button 
      size="icon" 
      variant="ghost" 
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}

const formatLabels: Record<VideoFormat, { icon: typeof Video; label: string }> = {
  mp4: { icon: Video, label: "MP4" },
  webm: { icon: Film, label: "WebM" },
  mp3: { icon: Music, label: "Audio (MP3)" },
};

const qualityLabels: Record<VideoQuality, string> = {
  "1080p": "1080p HD",
  "720p": "720p",
  "480p": "480p",
  "360p": "360p",
};

export default function Home() {
  const { toast } = useToast();
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat>("mp4");
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("1080p");
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);

  const form = useForm<ParseUrlRequest>({
    resolver: zodResolver(parseUrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const parseUrlMutation = useMutation({
    mutationFn: async (data: ParseUrlRequest) => {
      const response = await apiRequest("POST", "/api/parse-url", data);
      return await response.json() as VideoInfo;
    },
    onSuccess: (data) => {
      const formats = data.availableFormats || [];
      const qualities = data.availableQualities || [];
      setVideoInfo({
        ...data,
        availableFormats: formats,
        availableQualities: qualities,
      });
      setDownloadProgress(null);
      if (formats.length > 0) {
        setSelectedFormat(formats[0]);
      }
      if (qualities.length > 0) {
        setSelectedQuality(qualities[0]);
      }
      toast({
        title: "Video found!",
        description: `"${data.title}" is ready for download.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to parse URL",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!videoInfo) return;
      
      setDownloadProgress({
        id: videoInfo.id,
        status: "preparing",
        progress: 0,
        message: "Preparing download...",
      });

      const response = await apiRequest("POST", "/api/download", {
        url: form.getValues("url"),
        format: selectedFormat,
        quality: selectedQuality,
      });
      
      return await response.json() as { downloadId: string };
    },
    onSuccess: (data) => {
      if (data) {
        simulateProgress(data.downloadId);
      }
    },
    onError: (error: Error) => {
      setDownloadProgress({
        id: videoInfo?.id || "",
        status: "error",
        progress: 0,
        message: error.message || "Download failed. Please try again.",
      });
    },
  });

  const simulateProgress = async (downloadId: string) => {
    const stages = [
      { status: "preparing" as const, progress: 10, message: "Preparing download..." },
      { status: "downloading" as const, progress: 25, message: "Downloading..." },
      { status: "downloading" as const, progress: 50, message: "Downloading..." },
      { status: "downloading" as const, progress: 75, message: "Downloading..." },
      { status: "processing" as const, progress: 90, message: "Processing video..." },
      { status: "complete" as const, progress: 100, message: "Download complete!", downloadUrl: "#", fileSize: "45.2 MB" },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDownloadProgress({
        id: downloadId,
        ...stage,
      });
    }

    toast({
      title: "Download complete!",
      description: "Your video is ready.",
    });
  };

  const onSubmit = (data: ParseUrlRequest) => {
    setVideoInfo(null);
    setDownloadProgress(null);
    parseUrlMutation.mutate(data);
  };

  const handleDownload = () => {
    if (videoInfo) {
      downloadMutation.mutate();
    }
  };

  const isAudioOnly = selectedFormat === "mp3";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Download className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold" data-testid="text-app-title">VideoGrab</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        <section className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight" data-testid="text-hero-title">
            Download Videos Instantly
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Paste a video URL from YouTube, Vimeo, or other platforms. Choose your format and quality, then download.
          </p>
        </section>

        <section className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                            className="h-14 pl-12 pr-4 text-base rounded-lg"
                            data-testid="input-video-url"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          size="lg"
                          className="h-14 px-8 rounded-lg text-[15px] font-medium"
                          disabled={parseUrlMutation.isPending}
                          data-testid="button-parse-url"
                        >
                          {parseUrlMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Parsing...
                            </>
                          ) : (
                            "Get Video"
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </section>

        {videoInfo && (
          <>
            <Card className="overflow-hidden" data-testid="card-video-preview">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[320px_1fr] gap-0">
                  <div className="relative aspect-video md:aspect-auto bg-muted">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                      data-testid="img-video-thumbnail"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2" data-testid="text-video-title">
                      {videoInfo.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span data-testid="text-video-channel">{videoInfo.channel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span data-testid="text-video-duration">{videoInfo.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Film className="w-4 h-4" />
                        <span data-testid="text-video-platform">{videoInfo.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {videoInfo.availableFormats.length > 0 && videoInfo.availableQualities.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3" role="radiogroup" aria-label="Select video format">
                  <label className="text-sm font-medium">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    {videoInfo.availableFormats.map((format) => {
                      const { icon: Icon, label } = formatLabels[format];
                      const isSelected = selectedFormat === format;
                      return (
                        <button
                          key={format}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedFormat(format)}
                          className={`
                            relative p-4 rounded-lg border text-center transition-all
                            ${isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover-elevate"
                            }
                          `}
                          data-testid={`button-format-${format}`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${isSelected ? "" : "text-muted-foreground"}`}>
                            {label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3" role="radiogroup" aria-label="Select video quality">
                  <label className="text-sm font-medium">
                    {isAudioOnly ? "Audio Quality" : "Video Quality"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {videoInfo.availableQualities.map((quality) => {
                      const isSelected = selectedQuality === quality;
                      const isDisabled = isAudioOnly && quality !== "360p" && quality !== "480p";
                      return (
                        <button
                          key={quality}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedQuality(quality)}
                          disabled={isDisabled}
                          className={`
                            relative p-3 rounded-lg border text-center transition-all
                            ${isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover-elevate"
                            }
                            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          data-testid={`button-quality-${quality}`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? "" : "text-muted-foreground"}`}>
                            {qualityLabels[quality]}
                          </span>
                          {quality === "1080p" && !isAudioOnly && (
                            <span className="ml-2 text-xs text-primary font-medium">Best</span>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {downloadProgress && (
              <Card className="bg-card" data-testid="card-download-progress">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {downloadProgress.status === "complete" ? (
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                      ) : downloadProgress.status === "error" ? (
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium" data-testid="text-download-status">
                          {downloadProgress.message}
                        </p>
                        {downloadProgress.fileSize && (
                          <p className="text-sm text-muted-foreground" data-testid="text-file-size">
                            File size: {downloadProgress.fileSize}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-semibold" data-testid="text-progress-percent">
                      {downloadProgress.progress}%
                    </span>
                  </div>
                  <Progress value={downloadProgress.progress} className="h-2" data-testid="progress-download" />
                  {downloadProgress.status === "complete" && downloadProgress.downloadUrl && (
                    <Button 
                      className="w-full h-12 text-[15px] font-medium mt-2"
                      data-testid="button-save-file"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Save File
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {!downloadProgress && (
              <Button
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
                className="w-full h-14 text-[15px] font-medium rounded-lg"
                data-testid="button-download"
              >
                {downloadMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting Download...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download {isAudioOnly ? "Audio" : "Video"}
                  </>
                )}
              </Button>
            )}
          </>
        )}

        {!videoInfo && !parseUrlMutation.isPending && (
          <Card className="border-dashed" data-testid="card-empty-state">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No video selected</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Paste a video URL above to get started. We support YouTube, Vimeo, Dailymotion, and many more platforms.
              </p>
            </CardContent>
          </Card>
        )}

        {parseUrlMutation.isPending && (
          <Card data-testid="card-loading-state">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-medium mb-2">Fetching video info...</h3>
              <p className="text-muted-foreground">
                Please wait while we analyze the video URL.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            VideoGrab supports YouTube, Vimeo, Dailymotion, Facebook, Twitter, and 100+ other platforms.
          </p>
        </div>
      </footer>
    </div>
  );
}
