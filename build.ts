import { toFile } from "qrcode";
import { minify } from "html-minifier-terser";
import { readFileSync } from "node:fs";

const originalHTML = await minify(readFileSync("index.html").toString(), {
  minifyJS: {compress: {
    drop_console: true,
  },
  mangle: true,
  },
  minifyCSS: true,
  html5: true,
  removeComments: true,
  collapseWhitespace: true,
});

console.log(originalHTML + "\n")

// Compression algorithm
// Originally made by AI because I didn't understand ReadableStreams and Uint8Arrays,
// but I did rewrite a lot of it to minify and fix it
async function compress(str: string) {
  const compressedData = btoa(
    String.fromCharCode(...new Uint8Array(Bun.deflateSync(str))),
  );
  return await minify(
    `<script>
      let bs = atob('${compressedData}');
      let q = new Uint8Array(bs.length);
      for (let i = 0; i < bs.length; i++) q[i] = bs.charCodeAt(i);
      (async () => {
        document.write(
          await (new Response(new ReadableStream({
            start(c) {
              c.enqueue(q);
              c.close();
            }
          }).pipeThrough(new DecompressionStream('deflate-raw'))
          ).text())
        )
      })();
    </script>`,
    {
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true,
    },
  );
}

const compressedHTML = await compress(originalHTML);

const properHTML =
  compressedHTML.length < originalHTML.length ? compressedHTML : originalHTML;

console.log(properHTML, properHTML.length);

toFile("qr.png", `data:text/html,${properHTML}`, {
  type: "png",
  errorCorrectionLevel: "L"
});
