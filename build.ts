import { toFile } from "qrcode";
import { minify } from "html-minifier-terser";
import { readFileSync } from "node:fs";

const originalHTML = await minify(readFileSync("index.html").toString(), {
  minifyJS: true,
  minifyCSS: true,
  html5: true,
  removeComments: true,
  collapseWhitespace: true,
});

// Compression algorithm
// Originally made by AI because I didn't understand ReadableStreams and Uint8Arrays,
// but I did rewrite a lot of it to minify and fix it
async function compress(str: string) {
  const compressedData = btoa(
    String.fromCharCode(...new Uint8Array(Bun.deflateSync(str))),
  );
  return await minify(
    `<script>
      let compressedString = atob('${compressedData}');
      let arr = new Uint8Array(compressedString.length);
      for (let i = 0; i < compressedString.length; i++) arr[i] = compressedString.charCodeAt(i);
      new Response(new ReadableStream({
        start(controller) {
          controller.enqueue(arr);
          controller.close();
        }
      }).pipeThrough(new DecompressionStream('deflate-raw'))).text().then((a) => document.write(a))
    </script>`,
    {
      minifyJS: {
        mangle: true,
        toplevel: true, // This is safe here, but not in the actual minification of the program
      },
      removeComments: true,
      collapseWhitespace: true,
    },
  );
}

const compressedHTML = await compress(originalHTML);

const properHTML =
  compressedHTML.length < originalHTML.length ? compressedHTML : originalHTML;

console.log(properHTML);

toFile("qr.png", `data:text/html,${properHTML}`, {
  type: "png",
  errorCorrectionLevel: "L",
});
