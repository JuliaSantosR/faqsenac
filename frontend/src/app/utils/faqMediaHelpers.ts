const ALLOWED_VIDEO_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'player.vimeo.com',
  'vimeo.com',
  'www.vimeo.com',
]);

export function normalizeVideoUrl(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return '';
  }

  try {
    const url = new URL(trimmedValue);
    const host = url.hostname.toLowerCase();

    if (host === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (host === 'youtube.com' || host === 'www.youtube.com') {
      if (url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }

      if (url.pathname.startsWith('/embed/') || url.pathname.startsWith('/shorts/')) {
        const segments = url.pathname.split('/').filter(Boolean);
        const videoId = segments[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }
    }

    if (host === 'vimeo.com' || host === 'www.vimeo.com') {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }

    if (host === 'player.vimeo.com') {
      return url.toString();
    }

    return trimmedValue;
  } catch {
    return trimmedValue;
  }
}

export function getSafeVideoUrl(value: string) {
  const normalizedValue = normalizeVideoUrl(value);
  if (!normalizedValue) {
    return null;
  }

  try {
    const url = new URL(normalizedValue);
    if (url.protocol !== 'https:' || !ALLOWED_VIDEO_HOSTS.has(url.hostname.toLowerCase())) {
      return null;
    }

    if (
      (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') &&
      !url.pathname.startsWith('/embed/')
    ) {
      return null;
    }

    if (url.hostname === 'player.vimeo.com' && !url.pathname.startsWith('/video/')) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function isValidImageUrl(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return true;
  }

  try {
    const url = new URL(trimmedValue);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
