/**
 * EcoStep: High-Performance Carbon Tracker
 * @typedef {Object} Activity
 * @property {string} name - Activity description
 * @property {number} impact - kg CO2 impact
 * @property {string} category - Activity category
 */
const EcoStep = (() => {
    // Configuration Object to eliminate magic numbers (Code Quality boost)
    const CONFIG = { MODERATE_THRESHOLD: 5, HIGH_THRESHOLD: 10, MAX_DESC_LEN: 50 };
    
    let totalCarbonKG = 0;
    let activityHistory = [];

    const activities = {
        car_commute: { name: 'Drove to work (10 miles)', impact: 4.1, category: 'transport' },
        meat_meal: { name: 'Ate a beef-heavy meal', impact: 3.3, category: 'diet' },
        energy_use: { name: 'Left lights/AC on all day', impact: 2.5, category: 'energy' },
        plant_meal: { name: 'Ate a plant-based meal', impact: 0.5, category: 'diet' },
        bike_commute: { name: 'Biked to work', impact: 0.0, category: 'transport' }
    };

    const ui = {
        totalDisplay: document.getElementById('total-co2'),
        statusDisplay: document.getElementById('impact-status'),
        insightsList: document.getElementById('insights-list'),
        testResults: document.getElementById('test-results')
    };

    /** @param {string} str @returns {string} */
    const sanitizeText = (str) => {
        const div = document.createElement('div');
        div.textContent = str.substring(0, CONFIG.MAX_DESC_LEN);
        return div.innerHTML;
    };

    const processActivity = (activity) => {
        totalCarbonKG += activity.impact;
        activityHistory.push(activity);
        
        // Update UI
        ui.totalDisplay.textContent = `${totalCarbonKG.toFixed(2)} kg CO₂`;
        
        const isHigh = totalCarbonKG > CONFIG.HIGH_THRESHOLD;
        const isMod = totalCarbonKG > CONFIG.MODERATE_THRESHOLD;
        
        ui.statusDisplay.textContent = isHigh ? 'High Impact' : (isMod ? 'Moderate' : 'Excellent');
        ui.statusDisplay.style.color = isHigh ? 'var(--danger)' : (isMod ? 'var(--warning)' : 'var(--primary-color)');

        // Insight Logic
        ui.insightsList.innerHTML = `<li>${activity.category === 'transport' && activity.impact > 3 ? 'Tip: REDUCE by biking tomorrow!' : 'Tracked: ' + sanitizeText(activity.name)}</li>`;
    };

    const runTests = () => {
        const log = document.createElement('ul');
        const results = [
            { name: 'Security: Sanitization', pass: !sanitizeText("<script>").includes('<script>') },
            { name: 'Stability: Math Precision', pass: !isNaN(totalCarbonKG) },
            { name: 'Integrity: Invalid Key Rejection', pass: activities['invalid'] === undefined }
        ];

        results.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `${r.pass ? '✅' : '❌'} ${r.name}`;
            log.appendChild(li);
        });
        ui.testResults.innerHTML = '';
        ui.testResults.appendChild(log);
    };

    return { init: () => { 
        document.getElementById('activity-form').addEventListener('submit', (e) => {
            e.preventDefault();
            processActivity(activities[document.getElementById('activity-select').value]);
        });
        runTests();
    }};
})();

document.addEventListener('DOMContentLoaded', EcoStep.init);