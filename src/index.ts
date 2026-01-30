import acto from '@abcnews/alternating-case-to-object';
import { whenOdysseyLoaded, requestDOMPermit } from '@abcnews/env-utils';
import { proxy } from '@abcnews/dev-proxy';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import url2cmid from '@abcnews/url2cmid';
import { fetchOne, getImages } from '@abcnews/terminus-fetch';
import type { Mount } from '@abcnews/mount-utils';
import App from './components/App.svelte';
import Header from './components/Header.svelte';
import { mount } from "svelte";

const DECOY_KEY = 'ocean';
const DEFAULT_IMAGE_RATIO = '3x2';
const DETAIL_IMAGE_RATIO = '16x9';

export type Block = {
  width: 'max' | number | undefined;
  align: 'top' | 'bottom';
  depth: number;
  elements: (HTMLElement | BlockImage)[];
};

type Collector = {
  next?: Block;
  blocks: Block[];
};

type BlockImageRendition = {
  url: string;
  width: number;
  ratio: string;
};

export type BlockImage = {
  alt: string;
  url: string;
  renditions: BlockImageRendition[];
};

type TerminusImageData = {
  [key: string]: BlockImage;
};

const getEmbeddedImageData = async (id: string) => {
  const { _embedded } = await fetchOne({ id });
  const media = _embedded?.mediaEmbedded || [];

  return media.reduce<TerminusImageData>((images, embed: any) => {
    try {
      const widths = [1800, 1200, 480, 240, 120];
      const imageData = getImages(embed, widths);
      const alt = imageData.alt || imageData.title || '';
      const id = imageData.cmid;
      images[id] = { alt, url: '', renditions: imageData.renditions };
      return images;
    } catch (e) {
      // this ignores embeds which aren't images (which will throw an error when passed to getImages)
      return images;
    }
  }, {});
};

let appMountEl: Mount;
let appProps;

let embeddedImageDataPromise: Promise<TerminusImageData>;

// Fire of a request for the embedded image data ASAP.
const id = document.querySelector('meta[name=ContentId]')?.getAttribute('content') || url2cmid(document.location.href);

if (!id) throw new Error('Content ID could not be determined');

embeddedImageDataPromise = getEmbeddedImageData(id);

const isMount = (el: Element): el is Mount => {
  return 'tag' in (el as HTMLElement).dataset;
};

const isBlockConfig = (el: Element): el is HTMLDivElement =>
  el.tagName === 'DIV' && (el.getAttribute('id')?.startsWith('block') || false);

const isImage = (el: unknown): el is HTMLElement =>
  typeof el !== 'undefined' && el instanceof HTMLElement && el.querySelectorAll('img').length > 0;

const parseImage = async (el: HTMLElement, defaultImageRatio: string) => {
  const img = el.querySelector('img');
  const caption = el.querySelector('figcaption');
  const id = caption?.getAttribute('id') || el.dataset?.uri?.replace('coremedia://image/', '');
  const alt = img?.getAttribute('alt');
  const url = img?.dataset.src || img?.getAttribute('src');
  if (typeof id === 'undefined' || id === null || typeof alt !== 'string' || typeof url !== 'string') {
    return null;
  }

  const image: BlockImage = { alt, url, renditions: [] };
  const embeddedImageData = await embeddedImageDataPromise;
  const availableRenditions = embeddedImageData[id].renditions;

  // If there are no renditions, just return what we've got.
  if (availableRenditions.length === 0) {
    return image;
  }

  // Try to find the requested ratio
  const ratios = [defaultImageRatio, DEFAULT_IMAGE_RATIO, availableRenditions[0].ratio];

  while (image.renditions.length === 0) {
    const ratio = ratios.shift();

    image.renditions = availableRenditions.filter(d => d.ratio === ratio);
  }

  return image;
};

const createImage = (data: BlockImage) => {
  const img = document.createElement('img');
};

const parseDOM = async (el: Element) => {
  const children = Array.from(el.children);
  return (
    await children.reduce<Promise<Collector>>(async (collectorPromise, child, idx, arr) => {
      const collector = await collectorPromise;

      // If this is a title
      if (isBlockConfig(child)) {
        if (collector.next) {
          collector.blocks.push(collector.next);
        }
        const config = acto(child.getAttribute('id') || '');
        collector.next = {
          width: typeof config.width === 'number' || config.width === 'max' ? config.width : undefined,
          depth: config.depth ? +config.depth : 0,
          align: config.align === 'bottom' ? 'bottom' : 'top',
          elements: []
        };
        return collector;
      }

      // If this is an image (and we're already collecting)
      if (collector.next && isImage(child)) {
        const image = await parseImage(child, DETAIL_IMAGE_RATIO);

        if (image !== null) {
          collector.next.elements.push(image);
        }
      }

      // Otherwise, this is just content, so push it into the details.
      if (child instanceof HTMLElement && !isImage(child)) collector.next?.elements.push(child);

      // Add the final card
      if (idx === arr.length - 1 && collector.next) {
        collector.blocks.push(collector.next);
        collector.next = undefined;
      }
      return collector;
    }, Promise.resolve({ blocks: [] }))
  ).blocks;
};

Promise.all([proxy('interactive-artemis-ii'), whenOdysseyLoaded]).then(async () => {
  // Load the header graphic

  const headerMounts = selectMounts('graphicheader') as unknown as (HTMLElement & Mount)[];
  headerMounts.forEach(el => {
    el.style.margin = '0';
    el.style.position = 'absolute';
    el.style.zIndex = '-1';
    el.style.top = '0';
    el.style.height = '100%';
    el.style.width = '100%';
    if (el.parentElement?.parentElement) {
      el.parentElement.style.paddingBottom = '200px';
      el.parentElement.style.zIndex = '0';
      el.parentElement.parentElement.style.marginBottom = '0';
    }
    mount(Header, { target: el });
  });

  // Load the main ocean section

  const instances = await requestDOMPermit(DECOY_KEY);

  if (instances === true) {
    return console.error(new Error('requestDOMPermit thinks this is not PL'));
  }

  instances.forEach(async el => {
    el.dataset['used'] = 'true';
    if (!isMount(el)) return;

    appProps = acto(getMountValue(el));
    const blocks = await parseDOM(el);
    el.textContent = null;
    mount(App, { target: el, props: { ...appProps, blocks } });
  });
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[The Deep] public path: ${__webpack_public_path__}`);
}
