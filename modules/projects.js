// Bring in raw data files
const sectorFile = require("../data/sectorData.json");
const projectFile = require("../data/projectData.json");

// Local container
let projects = [];

/**
 * Prepare project list by attaching sector names
 */
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Clear any previous values
            projects.length = 0;

            // Manually build new array
            for (let i = 0; i < projectFile.length; i++) {
                const proj = projectFile[i];
                let sectorName = "Unknown";

                // find sector by matching ID
                for (let j = 0; j < sectorFile.length; j++) {
                    if (sectorFile[j].id === proj.sector_id) {
                        sectorName = sectorFile[j].sector_name;
                        break;
                    }
                }

                // push project with new sector field
                projects.push({
                    ...proj,
                    sector: sectorName
                });
            }

            resolve("Initialization successful");
        } catch (err) {
            reject("Failed to set up project data");
        }
    });
}

/**
 * Get all projects in system
 */
function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects && projects.length) {
            resolve(projects);
        } else {
            reject("No projects are currently stored");
        }
    });
}

/**
 * Find project by id
 */
function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const numId = Number(projectId);
        const result = projects.filter(p => p.id === numId);

        if (result.length > 0) {
            resolve(result[0]);
        } else {
            reject(`Project with id ${projectId} not found`);
        }
    });
}

/**
 * Find all projects in a given sector (case-insensitive, partial allowed)
 */
function getProjectsBySector(sectorKey) {
    return new Promise((resolve, reject) => {
        if (!sectorKey) {
            reject("Sector keyword missing");
            return;
        }

        const key = sectorKey.toLowerCase();
        const found = [];

        for (const proj of projects) {
            if (proj.sector.toLowerCase().includes(key)) {
                found.push(proj);
            }
        }

        if (found.length > 0) {
            resolve(found);
        } else {
            reject(`No projects match sector: ${sectorKey}`);
        }
    });
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};
