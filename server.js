/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy.
 *
 *  Name: Dhairya Rakeshkumar Mehta     Student ID: 170367239     Date: 2025-11-11
 *
 *  Published URL: https://web322-f25-a2.vercel.app/
 ********************************************************************************/


const express = require("express");
const path = require("path");

// Load JSON directly instead of ./data/projects.js
const projects = require("./data/projectData.json");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Configure EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files
app.use(express.static("public"));

/* ROUTES*/

// Home
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// All projects OR by sector
app.get("/solutions/projects", (req, res) => {
  try {
    const { sector } = req.query;
    let filtered = projects;

    if (sector) {
      // Check if user provided a number (like sector=1) or a string (like sector=Industry)
      const sectorId = parseInt(sector);

      if (!isNaN(sectorId)) {
        // Numeric filter (for sector_id)
        filtered = projects.filter(p => p.sector_id === sectorId);
      } else {
        // Text-based filter (in case JSON has sector strings in future)
        filtered = projects.filter(
          p => p.sector && typeof p.sector === "string" && p.sector.toLowerCase() === sector.toLowerCase()
        );
      }

      // If no matches found, show 404
      if (filtered.length === 0) {
        return res.status(404).render("404", {
          page: "",
          message: `No projects found for sector "${sector}".`,
        });
      }
    }

    // Render results
    res.render("projects", {
      page: "/solutions/projects",
      projects: filtered,
    });
  } catch (err) {
    res.status(500).render("404", { page: "", message: err.message });
  }
});


// Single project by ID
app.get("/solutions/projects/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.status(404).render("404", {
        page: "",
        message: `Project with ID ${id} not found.`,
      });
    }

    res.render("project", { page: "", project });
  } catch (err) {
    res.status(404).render("404", { page: "", message: err.message });
  }
});

// Handle all other routes (404)
app.use((req, res) => {
  res
    .status(404)
    .render("404", {
      page: "",
      message: " we're unable to find what you're looking for.",
    });
});

/* START SERVER*/
app.listen(HTTP_PORT, () =>
  console.log(`Server running at http://localhost:${HTTP_PORT}`)
);
