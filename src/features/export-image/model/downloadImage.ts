export function downloadImage(blob: Blob) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "veil-image.png";

  link.click();

  URL.revokeObjectURL(url);
}
