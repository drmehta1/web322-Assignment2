/********************************************************************************
* WEB322 – Assignment 01
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: ____Dhairya Rakeshkumar Mehta__________________ Student ID: ___170367239___________ Date: _______1st October 2025_______
*
********************************************************************************/

const express = require("express");
const projectService = require("./modules/projects.js");

const app = express();
const PORT = process.env.PORT || 8080;

// Start server only after initialization succeeds
projectService.initialize()
    .then((msg) => {
        console.log(msg);

        // Root endpoint
        app.get("/", (req, res) => {
            res.send("Assignment 1 - WEB322 : Dhairya Mehta (170367239)");
        });

        // Fetch all projects
        app.get("/solutions/projects", async (req, res) => {
            try {
                const all = await projectService.getAllProjects();
                res.json(all);
            } catch (err) {
                res.status(500).json({ error: err });
            }
        });

        // Example: Get project by ID
        app.get("/solutions/projects/id-demo", async (req, res) => {
            try {
                const project = await projectService.getProjectById(9); // sample ID
                res.json(project);
            } catch (err) {
                res.status(404).json({ error: err });
            }
        });

        // Example: Get projects by sector keyword
        app.get("/solutions/projects/sector-demo", async (req, res) => {
            try {
                const list = await projectService.getProjectsBySector("agriculture");
                res.json(list);
            } catch (err) {
                res.status(404).json({ error: err });
            }
        });

        // Start listening
        app.listen(PORT, () => {
            console.log(`Server is live at: http://localhost:${PORT}`);
        });

    })
    .catch((err) => {
        console.error("Initialization error:", err);
    });