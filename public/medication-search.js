/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
===============================================*/

// Medication data (will be fetched from database)
let medications = [];

// Dosage modal elements
const dosageModal = document.getElementById('dosageModal');
const selectedMedName = document.getElementById('selectedMedName');
const dosageAmount = document.getElementById('dosageAmount');
const dosageUnit = document.getElementById('dosageUnit');
const saveDosageBtn = document.getElementById('saveDosageBtn');
const medicationSearch = document.getElementById('medicationSearch');
const searchBtn = document.getElementById('searchBtn');
const medicationList = document.getElementById('medicationList');

let selectedMedication = null;
let userMedications = {};

// Fetch medications from database
async function fetchMedications() {
    try {
        const response = await fetch('http://localhost:3000/api/medications');
        
        if (!response.ok) {
            throw new Error('Failed to fetch medications');
        }
        
        const data = await response.json();
        medications = data; // Already sorted alphabetically from backend
        
        console.log('Medications loaded:', medications.length);
        displayMedications(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        medicationList.innerHTML = '<p style="text-align: center; color: #ff5869; padding: 2vh;">❌ Failed to load medications. Make sure the server is running at http://localhost:3000</p>';
    }
}

// Display all medications
function displayMedications(meds) {
    medicationList.innerHTML = '';
    
    if (meds.length === 0) {
        medicationList.innerHTML = '<p style="text-align: center; color: #999; padding: 2vh;">No medications found.</p>';
        return;
    }
    
    meds.forEach(med => {
        const medItem = document.createElement('div');
        medItem.className = 'medication-item';
        medItem.textContent = med;
        medItem.addEventListener('click', () => openDosageModal(med));
        medicationList.appendChild(medItem);
    });
    
    console.log('Displayed', meds.length, 'medications');
}

// Open dosage modal
function openDosageModal(medName) {
    selectedMedication = medName;
    selectedMedName.textContent = medName;
    
    // Load existing dosage if available
    if (userMedications[medName]) {
        dosageAmount.value = userMedications[medName].amount;
        dosageUnit.value = userMedications[medName].unit;
    } else {
        dosageAmount.value = '';
        dosageUnit.value = '';
    }
    
    dosageModal.style.display = 'block';
    console.log('Modal opened for:', medName);
}

// Close dosage modal
function closeDosageModal() {
    dosageModal.style.display = 'none';
    console.log('Modal closed');
}

// Save dosage to database
async function saveDosageToDatabase(medication, amount, unit) {
    try {
        const response = await fetch('http://localhost:3000/api/user-medications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                medication: medication,
                amount: amount,
                unit: unit
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save medication');
        }
        
        const result = await response.json();
        console.log('Saved to database:', result);
        alert('Medication saved successfully!');
        return result;
    } catch (error) {
        console.error('Error saving medication:', error);
        
        // Check if user is not logged in
        if (error.message.includes('redirect') || error.message.includes('login')) {
            alert('Please log in to save medications.');
            window.location.href = '/login';
        } else {
            alert('Failed to save medication: ' + error.message);
        }
    }
}

// Save dosage
saveDosageBtn.addEventListener('click', async () => {
    if (selectedMedication && dosageAmount.value && dosageUnit.value) {
        // Save locally
        userMedications[selectedMedication] = {
            amount: dosageAmount.value,
            unit: dosageUnit.value
        };
        
        console.log('Medication info:', selectedMedication, userMedications[selectedMedication]);
        
        // Save to database
        await saveDosageToDatabase(
            selectedMedication, 
            dosageAmount.value, 
            dosageUnit.value
        );
        
        closeDosageModal();
    } else {
        alert('Please fill in all fields');
    }
});

// Search functionality
function searchMedications() {
    const searchTerm = medicationSearch.value.toLowerCase();
    const filtered = medications.filter(med => 
        med.toLowerCase().includes(searchTerm)
    );
    displayMedications(filtered);
}

medicationSearch.addEventListener('input', searchMedications);
searchBtn.addEventListener('click', searchMedications);

// Close modal when clicking outside
dosageModal.addEventListener('click', (e) => {
    if (e.target === dosageModal) {
        closeDosageModal();
    }
});

// Initialize - fetch medications when page loads
console.log('Initializing medication search...');
fetchMedications();