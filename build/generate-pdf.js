import { spawn } from "child_process";
import puppeteer from "puppeteer";

async function renderToPDF(url, outputPath) {
  const browser = await puppeteer.launch({
    browser: "chrome",
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.pdf({
    path: outputPath,
    preferCSSPageSize: true,
  });

  await browser.close();
}

function startVitePreview() {
  return new Promise((resolve, reject) => {
    // Spawn process in its own group
    const server = spawn("npm", ["run", "build && vite preview"], {
      shell: true, // Required for chaining commands
      stdio: ["pipe", "pipe", "pipe"],
      detached: true, // Allows killing all child processes
    });

    server.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`Vite preview stdout: ${output}`);

      // Check for localhost URL to indicate the server is running
      if (output.includes("http://localhost:3001")) {
        resolve(server);
      }
    });

    server.stderr.on("data", (data) => {
      console.error(`Vite preview stderr: ${data}`);
    });

    server.on("error", (error) => {
      reject(`Failed to start Vite preview: ${error.message}`);
    });

    server.on("close", (code) => {
      console.log(`Vite preview process exited with code ${code}`);
    });

    process.on("exit", () => {
      // Ensure the server is killed when the main process exits
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch (err) {
        console.error("Failed to kill process group:", err.message);
      }
    });
  });
}

async function main() {
  let server;
  try {
    server = await startVitePreview();
    console.log("Vite preview server started.");

    const url = "http://localhost:3001"; // Default Vite preview URL
    const outputPath = "dist/resume.pdf";

    await renderToPDF(url, outputPath);
    console.log("PDF saved successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (server) {
      console.log("Stopping Vite preview server...");
      try {
        process.kill(-server.pid, "SIGTERM"); // Kill the entire process group
      } catch (err) {
        console.error("Failed to kill Vite preview process:", err.message);
      }
    }
    process.exit(0); // Ensure the process exits
  }
}

// Handle unexpected exits and clean up
process.on("SIGINT", () => {
  console.log("Received SIGINT. Exiting...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Exiting...");
  process.exit(0);
});

main();
