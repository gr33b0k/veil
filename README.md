# Veil

**A browser-based image redaction tool.**

Veil helps you hide sensitive information in images. The goal is to make face redaction automatic while keeping manual tools available for censoring any other area.

## Features

- **Image upload** — load an image and start editing.
- **Manual redaction** — select rectangular areas or use a brush to censor any part of an image.
- **Multiple effects** — blur, solid fill, and pixelation.
- **Adjustable settings** — control brush size and effect intensity.
- **Editing controls** — select and remove redaction areas, undo and redo changes.
- **Canvas navigation** — zoom and pan around the image.
- **PNG export** — download the edited image.
- **Client-side processing** — image editing runs directly in the browser.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/gr33b0k/veil.git
cd veil
npm install
npm run dev
```

Open the local URL provided by Vite to use the application.

## Project Status

### Implemented

- [x] **Image upload** — upload images for editing.
- [x] **Canvas navigation** — zoom and pan around images.
- [x] **Manual redaction** — censor arbitrary areas using rectangular selections or a brush.
- [x] **Multiple redaction effects** — blur, solid fill, and pixelation.
- [x] **Adjustable settings** — configure brush size and effect intensity.
- [x] **Selection management** — select and delete redaction areas.
- [x] **Undo and redo** — revert and restore editing actions.
- [x] **PNG export** — download the edited image.
- [x] **Client-side image editing** — process images directly in the browser.

### Planned

- [ ] **Automatic face detection** — detect faces using an ML model running locally in the browser, without uploading images to a server.
- [ ] **Editable redaction areas** — adjust the position and size of individual redaction areas after creation.
- [ ] **Per-area effect settings** — customize the redaction effect and its intensity for each area independently.
- [ ] **Improved export workflow** — provide export feedback and handle errors.
- [ ] **Additional image formats** — support more input and output formats.
- [ ] **Deployment** — publish a publicly accessible version of Veil.

## Privacy

Veil is designed around client-side image processing. The goal is to keep images on the user's device rather than uploading them to a server.

Automatic face detection is planned and has not yet been implemented.

## License

Veil is licensed under the [MIT License](LICENSE).
