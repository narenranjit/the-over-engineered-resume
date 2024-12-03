import "./style.css";
// import  { html } from './resume.md';
import resume from "./resume.html?raw";

document.getElementById("app").innerHTML = resume;
// Write code to allow reading from a markdown file
