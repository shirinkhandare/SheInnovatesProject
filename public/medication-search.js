/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
===============================================*/

// Sample medication data (use this while testing, replace with database later)
let medications = [
    "Acetaminophen", "Aspirin", "Ibuprofen", "Naproxen",
    "Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline",
    "Atorvastatin", "Lisinopril", "Metformin", "Omeprazole",
    "Albuterol", "Gabapentin", "Hydrochlorothiazide", "Levothyroxine",
    "Losartan", "Metoprolol", "Prednisone", "Sertraline"
].sort();

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
}

// Open dosage modal
function openDosageModal(medName) {
    selectedMedication = medName;
    selectedMedName.textContent = medName;
    
    if (userMedications[medName]) {
        dosageAmount.value = userMedications[medName].amount;
        dosageUnit.value = userMedications[medName].unit;
    } else {
        dosageAmount.value = '';
        dosageUnit.value = '';
    }
    
    dosageModal.style.display = 'block';
}

// Close dosage modal
function closeDosageModal() {
    dosageModal.style.display = 'none';
}

// Save dosage
saveDosageBtn.addEventListener('click', () => {
    if (selectedMedication && dosageAmount.value && dosageUnit.value) {
        userMedications[selectedMedication] = {
            amount: dosageAmount.value,
            unit: dosageUnit.value
        };
        
        console.log('Medication saved:', selectedMedication, userMedications[selectedMedication]);
        
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

// Initialize - display medications when page loads
displayMedications(medications);