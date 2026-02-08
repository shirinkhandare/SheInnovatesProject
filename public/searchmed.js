/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
===============================================*/

// Medication data with side effects
let medications = {
    "Acetaminophen": "Common side effects: Nausea, stomach pain, loss of appetite, headache. Rare but serious: liver damage with high doses.",
    "Advil": "Common side effects: Upset stomach, heartburn, nausea, headache, dizziness. May increase risk of heart attack or stroke.",
    "Albuterol": "Common side effects: Nervousness, shaking, headache, fast heartbeat, dizziness, nausea.",
    "Alprazolam": "Common side effects: Drowsiness, dizziness, increased saliva, memory problems. Risk of dependence.",
    "Amitriptyline": "Common side effects: Drowsiness, dry mouth, blurred vision, constipation, weight gain, dizziness.",
    "Amlodipine": "Common side effects: Swelling of ankles/feet, dizziness, flushing, headache, fatigue.",
    "Amoxicillin": "Common side effects: Nausea, vomiting, diarrhea, rash, yeast infection.",
    "Aspirin": "Common side effects: Upset stomach, heartburn, nausea. May increase bleeding risk.",
    "Atenolol": "Common side effects: Dizziness, tiredness, cold hands/feet, slow heartbeat, nausea.",
    "Atorvastatin": "Common side effects: Muscle pain, diarrhea, upset stomach, joint pain.",
    "Azithromycin": "Common side effects: Nausea, diarrhea, vomiting, stomach pain, headache.",
    "Benadryl": "Common side effects: Drowsiness, dizziness, dry mouth, constipation, blurred vision.",
    "Bupropion": "Common side effects: Dry mouth, nausea, insomnia, headache, weight loss, increased sweating.",
    "Cetirizine": "Common side effects: Drowsiness, dry mouth, fatigue, dizziness.",
    "Ciprofloxacin": "Common side effects: Nausea, diarrhea, dizziness, headache. May cause tendon problems.",
    "Citalopram": "Common side effects: Nausea, dry mouth, drowsiness, insomnia, increased sweating.",
    "Claritin": "Common side effects: Headache, drowsiness, fatigue, dry mouth.",
    "Cyclobenzaprine": "Common side effects: Drowsiness, dizziness, dry mouth, fatigue, blurred vision.",
    "Diazepam": "Common side effects: Drowsiness, fatigue, muscle weakness, dizziness. Risk of dependence.",
    "Duloxetine": "Common side effects: Nausea, dry mouth, drowsiness, fatigue, constipation, loss of appetite.",
    "Escitalopram": "Common side effects: Nausea, drowsiness, dry mouth, increased sweating, sexual dysfunction.",
    "Fluoxetine": "Common side effects: Nausea, headache, drowsiness, insomnia, diarrhea, sexual dysfunction.",
    "Gabapentin": "Common side effects: Dizziness, drowsiness, fatigue, swelling in hands/feet.",
    "Hydrochlorothiazide": "Common side effects: Dizziness, headache, increased urination, low potassium.",
    "Ibuprofen": "Common side effects: Upset stomach, heartburn, nausea, headache, dizziness.",
    "Levothyroxine": "Common side effects: Hair loss (temporary), weight changes, headache, nervousness.",
    "Lisinopril": "Common side effects: Dizziness, headache, persistent dry cough, fatigue.",
    "Loratadine": "Common side effects: Headache, drowsiness, dry mouth, fatigue.",
    "Lorazepam": "Common side effects: Drowsiness, dizziness, weakness, unsteadiness. Risk of dependence.",
    "Losartan": "Common side effects: Dizziness, stuffy nose, back pain, diarrhea.",
    "Metformin": "Common side effects: Nausea, vomiting, diarrhea, stomach upset, metallic taste.",
    "Metoprolol": "Common side effects: Dizziness, tiredness, depression, shortness of breath, slow heartbeat.",
    "Montelukast": "Common side effects: Headache, dizziness, stomach pain, heartburn, fatigue.",
    "Naproxen": "Common side effects: Upset stomach, heartburn, drowsiness, headache, dizziness.",
    "Omeprazole": "Common side effects: Headache, nausea, diarrhea, stomach pain, gas.",
    "Prednisone": "Common side effects: Increased appetite, weight gain, insomnia, mood changes, high blood sugar.",
    "Sertraline": "Common side effects: Nausea, diarrhea, drowsiness, dry mouth, sexual dysfunction.",
    "Simvastatin": "Common side effects: Headache, nausea, stomach pain, constipation, muscle pain.",
    "Tramadol": "Common side effects: Dizziness, nausea, constipation, headache, drowsiness.",
    "Trazodone": "Common side effects: Drowsiness, dizziness, dry mouth, headache, blurred vision.",
    "Zolpidem": "Common side effects: Drowsiness, dizziness, diarrhea, grogginess. May cause sleepwalking.",
    
    // Birth Control & Hormones
    "Yaz": "Common side effects: Nausea, breast tenderness, headache, mood changes, weight changes, irregular bleeding.",
    "Yasmin": "Common side effects: Nausea, breast tenderness, headache, mood changes, weight changes.",
    "Ortho Tri-Cyclen": "Common side effects: Nausea, breast tenderness, headache, mood swings, breakthrough bleeding.",
    "Lo Loestrin Fe": "Common side effects: Nausea, breast tenderness, headache, mood changes, spotting between periods.",
    "Nuvaring": "Common side effects: Vaginal irritation, discharge, headache, nausea, breast tenderness.",
    "Mirena": "Common side effects: Irregular bleeding, headache, acne, breast tenderness, ovarian cysts.",
    "Nexplanon": "Common side effects: Irregular bleeding, headache, weight gain, acne, mood changes.",
    "Depo-Provera": "Common side effects: Weight gain, irregular bleeding, headache, mood changes, bone density loss.",
    "Plan B": "Common side effects: Nausea, fatigue, headache, dizziness, breast tenderness, irregular bleeding.",
    "Estradiol": "Common side effects: Nausea, bloating, breast tenderness, headache, mood changes.",
    "Progesterone": "Common side effects: Drowsiness, dizziness, headache, breast tenderness, mood changes.",
    
    // Additional Common Medications
    "Tylenol": "Common side effects: Nausea, stomach pain, loss of appetite, headache. Rare: liver damage with high doses.",
    "Xanax": "Common side effects: Drowsiness, dizziness, increased saliva, memory problems. High risk of dependence.",
    "Zoloft": "Common side effects: Nausea, diarrhea, drowsiness, dry mouth, sexual dysfunction, insomnia.",
    "Zyrtec": "Common side effects: Drowsiness, dry mouth, fatigue, dizziness, headache.",
    "Lexapro": "Common side effects: Nausea, insomnia, fatigue, drowsiness, sexual dysfunction, dry mouth.",
    "Prozac": "Common side effects: Nausea, headache, drowsiness, insomnia, sexual dysfunction, dry mouth.",
    "Wellbutrin": "Common side effects: Dry mouth, nausea, insomnia, headache, weight loss, increased sweating.",
    "Lipitor": "Common side effects: Muscle pain, diarrhea, upset stomach, joint pain, headache.",
    "Synthroid": "Common side effects: Hair loss (temporary), weight changes, headache, nervousness, increased sweating.",
    "Ambien": "Common side effects: Drowsiness, dizziness, diarrhea, grogginess. May cause sleepwalking or sleep-eating.",
    "Viagra": "Common side effects: Headache, flushing, upset stomach, stuffy nose, dizziness, vision changes.",
    "Ozempic": "Common side effects: Nausea, vomiting, diarrhea, stomach pain, constipation, decreased appetite.",
    "Jardiance": "Common side effects: Urinary tract infections, increased urination, yeast infections, nausea.",
    "Symbicort": "Common side effects: Headache, throat irritation, upper respiratory infection, oral thrush."
};

// Get sorted medication names
const medicationNames = Object.keys(medications).sort();

// Dosage modal elements
const dosageModal = document.getElementById('dosageModal');
const selectedMedName = document.getElementById('selectedMedName');
const sideEffectsText = document.getElementById('sideEffectsText');
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
    
    // Display side effects
    sideEffectsText.textContent = medications[medName] || "No side effect information available.";
    
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
            frequency: dosageFrequency.value,
            sideEffects: medications[selectedMedication]
        };
        
        console.log('Medication saved:', selectedMedication, userMedications[selectedMedication]);
        console.log('All saved medications:', userMedications);
        
        alert(`✅ ${selectedMedication} logged!\n${dosageAmount.value}${dosageUnit.value} - ${dosageFrequency.value}`);
        
        closeDosageModal();
    } else {
        alert('Please fill in all fields');
    }
});

// Search functionality
function searchMedications() {
    const searchTerm = medicationSearch.value.toLowerCase();
    const filtered = medicationNames.filter(med => 
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
console.log('Total medications available:', medicationNames.length);
displayMedications(medicationNames);