/** A screenshot of the real Motify editor. */
export interface ProductShot {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const MOTION_GRAPHICS_SHOT: ProductShot = {
  src: 'assets/solutions/motion-graphics-ui.webp',
  alt: 'The Motify editor: the brief and Tiffy’s plan on the left, a 9:16 launch ad for a Telegram sales bot in the preview, and its scenes, from Hook to End card, on the timeline.',
  width: 1911,
  height: 842,
};

export const VIDEO_EDITOR_SHOT: ProductShot = {
  src: 'assets/solutions/ai-video-editor-ui.webp',
  alt: 'The Motify AI Video Editor: caption and title tools on the left, a paper-documentary edit with Khmer captions in the preview, Tiffy’s chat with suggested edits on the right, and titles, captions, overlays, and clips on the timeline.',
  width: 1912,
  height: 834,
};

export const PSD_TO_VIDEO_SHOT: ProductShot = {
  src: 'assets/solutions/psd-to-video-ui.webp',
  alt: 'PSD to Video in the Motify editor: a 1200 by 630 Photoshop banner on the canvas and its eleven layers, including hidden ones, listed in the Design panel.',
  width: 1522,
  height: 837,
};
