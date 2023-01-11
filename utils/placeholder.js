//returns an placeholder image in base64 format - for next/image
export default function placeholder(img) {
  switch (img) {
    case "dark":
      return "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAAAQAwCdASoKABEAPjEUiEKiISEYBAAgAwS0gAA9hRTRDgAA/v3WJkh+bAAAAA==";
    case "light":
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    case "pinkPX":
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    default:
      //light
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
}
