import { send, wsWrapper } from '../helpers';
import { prisma } from '../prisma';
import type { WebSocket } from 'ws';
import type { Context } from '../types';
import { LinkAddSchema } from '../../shared/models/link';
import ogs from 'open-graph-scraper';

export async function linkRouter(
  ws: WebSocket,
  context: Context,
  type: string,
  data: any,
): Promise<void> {
  if (!context.userId) {
    return send(ws, { t: 'auth', data: 'Not authenticated' });
  }

  switch (type) {
    case 'link/list': {
      return wsWrapper(type, ws, async () => {
        const links = await prisma.link.findMany({
          where: { userId: context.userId },
          orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        });
        send(ws, { t: type, data: links });
      });
    }
    case 'link/add': {
      return wsWrapper(type, ws, async () => {
        const linkAddCommand = LinkAddSchema.parse(data);
        const metadata = await getMetadata(linkAddCommand.url);

        const { tagIds, ...linkData } = linkAddCommand;

        const link = await prisma.link.create({
          data: {
            ...linkData,
            userId: context.userId,
            title: metadata.title,
            description: metadata.description,
            tags: {
              createMany: {
                data: tagIds.map((tagId) => ({
                  tagId,
                  userId: context.userId,
                })),
              },
            },
          },
          include: {
            tags: true,
          },
        });

        send(ws, { t: `${type}/success`, data: link });
      });
    }
  }
}

enum LinkMetadataType {
  website = 'website',
  video = 'video',
  article = 'article',
  music = 'music',
}

interface LinkMetadata {
  url: string;
  parseTimeMs: number;
  parsedAt: Date;
  parseResult: 'success' | 'error';
  parseError?: string;
  type: LinkMetadataType;
  siteName?: string;
  faviconURL?: string;
  /** ISO 8601 */
  publishedAt?: string;
  locale?: string;
  title?: string;
  description?: string;
  imageURL?: string;
  imageMimeType?: string;
  videoURL?: string;
  videoMimeType?: string;
  audioURL?: string;
  audioMimeType?: string;
}

async function getMetadata(url: string): Promise<LinkMetadata> {
  const timeStart = new Date();
  const metadata: LinkMetadata = {
    url,
    type: LinkMetadataType.website,
    parseTimeMs: 0,
    parsedAt: timeStart,
    parseResult: 'success',
  };
  const result = await ogs({
    url,
    downloadLimit: 1000000,
    retry: { limit: 0 },
    timeout: { request: 10000 },
  });

  if (result.error) {
    metadata.parseTimeMs = new Date().getTime() - timeStart.getTime();
    metadata.parseResult = 'error';
    metadata.parseError = result.result.error;
    console.log(metadata);
    return metadata;
  }

  const og = result.result;

  console.log(og);

  // #region Base fields
  const domainData = parseDomain(url);
  metadata.siteName = og.ogSiteName || og.twitterSite || domainData?.siteName;
  metadata.faviconURL = domainData && handleRelativeURL(og.favicon, domainData.origin);
  metadata.title = og.ogTitle || og.twitterTitle;
  metadata.description = og.ogDescription || og.twitterDescription || og.dcDescription;
  metadata.description = metadata.description?.substring(0, 1000); // limit to 1000 characters
  metadata.type = og.ogType
    ? (Object.keys(LinkMetadataType).find((type) =>
        og.ogType?.startsWith(type),
      ) as LinkMetadataType) || LinkMetadataType.website
    : metadata.type;
  metadata.publishedAt =
    og.articlePublishedTime || og.ogArticlePublishedTime || og.dcDate || og.ogDate;
  metadata.locale = og.ogLocale || og.dcLanguage;
  // #endregion

  // #region Image
  if (og.ogImage) {
    const ogImage = Array.isArray(og.ogImage) ? og.ogImage[0] : og.ogImage;
    if (typeof ogImage === 'string') {
      metadata.imageURL = ogImage;
    } else {
      metadata.imageURL = ogImage.url;
      metadata.imageMimeType = ogImage.type;
    }
  } else if (og.twitterImage) {
    const twitterImage = Array.isArray(og.twitterImage) ? og.twitterImage[0] : og.twitterImage;
    if (typeof twitterImage === 'string') {
      metadata.imageURL = twitterImage;
    } else {
      metadata.imageURL = twitterImage.url;
    }
  }
  metadata.imageURL = metadata.imageURL
    ? domainData && handleRelativeURL(metadata.imageURL, domainData.origin)
    : undefined;
  // #endregion

  // #region Video
  if (og.ogVideo) {
    const ogVideo = Array.isArray(og.ogVideo) ? og.ogVideo[0] : og.ogVideo;
    if (typeof ogVideo === 'string') {
      metadata.videoURL = ogVideo;
    } else {
      metadata.videoURL = ogVideo.url;
      metadata.videoMimeType = ogVideo.type;
    }
  } else if (og.twitterPlayer) {
    const twitterPlayer = Array.isArray(og.twitterPlayer) ? og.twitterPlayer[0] : og.twitterPlayer;
    if (typeof twitterPlayer === 'string') {
      metadata.videoURL = twitterPlayer;
    } else {
      metadata.videoURL = twitterPlayer.url || twitterPlayer.stream;
    }
  }
  metadata.videoURL = metadata.videoURL
    ? domainData && handleRelativeURL(metadata.videoURL, domainData.origin)
    : undefined;
  // #endregion

  // #region Audio
  if (og.ogAudio) {
    metadata.audioURL = og.ogAudioURL || og.ogAudio;
    metadata.audioMimeType = og.ogAudioType;
    metadata.audioURL = metadata.audioURL
      ? domainData && handleRelativeURL(metadata.audioURL, domainData.origin)
      : undefined;
  }
  // #endregion

  const parseFinishedAt = new Date();
  metadata.parseTimeMs = parseFinishedAt.getTime() - timeStart.getTime();
  metadata.parsedAt = parseFinishedAt;
  console.log(metadata);

  return metadata;
}

function parseDomain(url: string): { siteName: string; origin: string } | undefined {
  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;
    return {
      siteName: hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname,
      origin: urlObject.origin,
    };
  } catch (error: unknown) {
    console.error('parseDomain', error);
    return undefined;
  }
}

function handleRelativeURL(url: undefined | string, origin: string): undefined | string {
  if (!url) {
    return undefined;
  }
  if (url.startsWith('/')) {
    return `${origin}/${url}`;
  }
  return url;
}
