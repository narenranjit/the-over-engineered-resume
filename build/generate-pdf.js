import { exec } from "child_process";
import puppeteer from "puppeteer";

async function renderToPDF(url, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.pdf({
    path: outputPath,
    format: "letter",
    printBackground: true,
  });

  await browser.close();
}

function startVitePreview() {
  return new Promise((resolve, reject) => {
    const server = exec("npm run build && vite preview", (error, stdout, stderr) => {
      if (error) {
        reject(`Error starting Vite preview: ${error.message}`);
      }
      if (stderr) {
        console.error(`Vite preview stderr: ${stderr}`);
      }
    });

    server.stdout.on("data", (data) => {
      console.log(`Vite preview stdout: ${data}`);
      if (data.includes("http://localhost:3001")) {
        resolve(server);
      }
    });
  });
}

async function main() {
  try {
    const server = await startVitePreview();
    console.log("Vite preview server started.");

    const url = "http://localhost:3001"; // Default Vite preview URL
    const outputPath = "dist/resume.pdf";

    await renderToPDF(url, outputPath);
    console.log("PDF saved successfully!");

    server.kill();
    console.log("Vite preview server stopped.");
    process.exit(0); // Ensure the process exits
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit with error code
  }
}

main();
