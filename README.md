# Quick Maths (Say Cheese!)

![QR code that has the game in it](qr.png)

This is a small game for the [Say Cheese](https://saycheese.hackclub.com) program by [Hack Club](https://hackclub.com).
It gives you 30 basic arithmetic questions for you to complete as fast as possible.
This webpage is designed for use on desktop computers and may not work on mobile devices.

## Contributing

You will need to have [Bun](https://bun.sh) installed. All of the HTML/CSS/JS is in `index.html` and the script to generate the QR code is `build.ts`.
```bash
bun install # Install dependencies (qrcode and html-minifier)

bun run build.ts # Regenerate the QR code
```
