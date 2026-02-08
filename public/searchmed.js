/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
===============================================*/

// Huge medication array (replaces database)
let medications = [
    "Acetaminophen", "Advil", "Albuterol", "Alendronate", "Allopurinol", "Alprazolam",
    "Amitriptyline", "Amlodipine", "Amoxicillin", "Aspirin", "Atenolol", "Atorvastatin",
    "Azithromycin", "Baclofen", "Benadryl", "Benzonatate", "Bupropion", "Buspirone",
    "Carvedilol", "Cephalexin", "Cetirizine", "Ciprofloxacin", "Citalopram", "Claritin",
    "Clindamycin", "Clopidogrel", "Clonazepam", "Clonidine", "Cyclobenzaprine",
    "Diazepam", "Diclofenac", "Diltiazem", "Diphenhydramine", "Doxycycline", "Duloxetine",
    "Eliquis", "Escitalopram", "Esomeprazole", "Famotidine", "Fexofenadine", "Finasteride",
    "Fluconazole", "Fluoxetine", "Fluticasone", "Furosemide", "Gabapentin", "Glipizide",
    "Hydrochlorothiazide", "Hydrocodone", "Hydroxyzine", "Ibuprofen", "Insulin", "Irbesartan",
    "Latanoprost", "Levothyroxine", "Lisinopril", "Loratadine", "Lorazepam", "Losartan",
    "Lovastatin", "Meloxicam", "Metformin", "Methotrexate", "Metoprolol", "Montelukast",
    "Naproxen", "Nifedipine", "Omeprazole", "Ondansetron", "Oxycodone", "Pantoprazole",
    "Paroxetine", "Penicillin", "Potassium Chloride", "Pravastatin", "Prednisone", "Pregabalin",
    "Promethazine", "Propranolol", "Quetiapine", "Ranitidine", "Rosuvastatin", "Sertraline",
    "Simvastatin", "Spironolactone", "Sulfamethoxazole", "Tamsulosin", "Tizanidine", "Topiramate",
    "Tramadol", "Trazodone", "Triamcinolone", "Tylenol", "Valacyclovir", "Valsartan",
    "Venlafaxine", "Verapamil", "Warfarin", "Xanax", "Zoloft", "Zolpidem", "Zyrtec",
    // Birth Control & Hormones
    "Yaz", "Yasmin", "Ortho Tri-Cyclen", "Lo Loestrin Fe", "Nuvaring", "Mirena",
    "Nexplanon", "Depo-Provera", "Plan B", "Ella", "Estradiol", "Progesterone",
    // Pain & Anti-inflammatory
    "Toradol", "Celebrex", "Mobic", "Voltaren", "Relafen", "Anaprox",
    // Antibiotics
    "Augmentin", "Bactrim", "Keflex", "Levaquin", "Zithromax", "Flagyl",
    // Diabetes
    "Lantus", "Humalog", "Novolog", "Ozempic", "Trulicity", "Jardiance", "Januvia",
    // Asthma/Respiratory
    "Symbicort", "Advair", "Ventolin", "ProAir", "Singulair", "Breo Ellipta",
    // Mental Health
    "Lexapro", "Prozac", "Wellbutrin", "Cymbalta", "Effexor", "Abilify", "Seroquel",
    // Blood Pressure
    "Norvasc", "Diovan", "Benicar", "Cozaar", "Coreg", "Toprol XL",
    // Cholesterol
    "Lipitor", "Crestor", "Zocor", "Pravachol", "Livalo",
    // Stomach/Digestive
    "Nexium", "Prilosec", "Prevacid", "Protonix", "Zantac", "Pepcid",
    // Thyroid
    "Synthroid", "Levoxyl", "Armour Thyroid", "Cytomel",
    // Sleep
    "Ambien", "Lunesta", "Restoril", "Sonata",
    // Allergy
    "Allegra", "Flonase", "Nasacort", "Patanase",
    // Other Common Meds
    "Viagra", "Cialis", "Flomax", "Propecia", "Latisse", "Restasis"
].sort();

// Dosage modal elements
const dosageModal = document.getElementById('dosageModal');
const selectedMedName = document.getElementById('selectedMedName');
const dosageAmount = document.getElementById('dosageAmount');
const dosageUnit = document.getElementById('dosageUnit');
const dosageFrequency = document.getElementById('dosageFrequency');
const saveDosageBtn = document.getElementById('saveDosageBtn');
const medicationSearch = document.getElementById('medicationSearch');
const searchBtn = document.getElementById('searchBtn');
const medicationList = document.getElementById('medicationList');

let selectedMedication = null;
let userMedications = {}; // Store user's medications locally

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
        dosageFrequency.value = userMedications[medName].frequency || '';
    } else {
        dosageAmount.value = '';
        dosageUnit.value = '';
        dosageFrequency.value = '';
    }
    
    dosageModal.style.display = 'block';
    console.log('Modal opened for:', medName);
}

// Close dosage modal
function closeDosageModal() {
    dosageModal.style.display = 'none';
    console.log('Modal closed');
}

// Save dosage (locally only - no database)
saveDosageBtn.addEventListener('click', () => {
    if (selectedMedication && dosageAmount.value && dosageUnit.value && dosageFrequency.value) {
        // Save locally
        userMedications[selectedMedication] = {
            amount: dosageAmount.value,
            unit: dosageUnit.value,
            frequency: dosageFrequency.value
        };
        
        console.log('Medication saved:', selectedMedication, userMedications[selectedMedication]);
        console.log('All saved medications:', userMedications);
        
        alert(`✅ ${selectedMedication} saved!\n${dosageAmount.value}${dosageUnit.value} - ${dosageFrequency.value}`);
        
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

// Initialize - display all medications on page load
console.log('Initializing medication search...');
console.log('Total medications available:', medications.length);
displayMedications(medications);