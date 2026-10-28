'use client';

import React from 'react';
import { PlayCircle, VideoOff } from 'lucide-react';

interface VideoPlayerProps {
  url?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(url?: string): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getLoomEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  return match ? `https://www.loom.com/embed/${match[1]}` : null;
}

export function getVimeoEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  title = 'Vídeo de demostración',
  autoPlay = true,
  className = 'w-full h-full'
}) => {
  if (!url) {
    return (
      <div className={`relative flex items-center justify-center bg-black/90 ${className}`}>
        {poster ? (
          <img src={poster} alt={title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <VideoOff className="w-8 h-8" />
            <span className="text-xs">Sin vídeo configurado</span>
          </div>
        )}
      </div>
    );
  }

  const youtubeId = getYouTubeVideoId(url);
  const loomEmbedUrl = getLoomEmbedUrl(url);
  const vimeoEmbedUrl = getVimeoEmbedUrl(url);

  if (youtubeId) {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    );
  }

  if (loomEmbedUrl) {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <iframe
          src={loomEmbedUrl}
          title={title}
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    );
  }

  if (vimeoEmbedUrl) {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <iframe
          src={`${vimeoEmbedUrl}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    );
  }

  // Fallback for direct MP4 / WebM video files
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        src={url}
        poster={poster}
        controls
        autoPlay={autoPlay}
        loop
        muted={autoPlay}
        playsInline
        className="w-full h-full object-cover"
      >
        Tu navegador no soporta reproducción de vídeo HTML5.
      </video>
    </div>
  );
};
