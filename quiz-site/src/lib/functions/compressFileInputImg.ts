export function compressFileInputImg(
  file: File,
  maxDimension: number,
  quality: number
) {
  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/jpg" &&
    file.type !== "image/png"
  ) {
    throw new Error("Invalid file type, must be jpeg or png");
  }
  if (quality < 0 || quality > 1)
    throw new Error("Invalid quality, must be between 0 and 1");
  if (maxDimension < 1)
    throw new Error("Invalid maxDimension, must be greater than 0");

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      if (file.size < 50000) resolve(reader.result as string);
      const img = new Image();
      img.src = reader.result as string;

      img.onload = function () {
        if (img.height > maxDimension || img.width > maxDimension) {
          let scale = 0;
          if (img.height > img.width) {
            scale = img.width / img.height;
            img.height = maxDimension;
            img.width = Math.floor(img.height * scale);
          } else {
            scale = img.height / img.width;
            img.width = maxDimension;
            img.height = Math.floor(img.width * scale);
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const compressedImg = canvas.toDataURL("image/jpeg", 0.5);
        resolve(compressedImg);
      };
    };
  });
}
