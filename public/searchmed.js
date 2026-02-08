/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
  - Connects to MongoDB database
  - Shows only menstrual effects
  - Displays only searched medication
===============================================*/

// Dosage modal elements
const dosageModal = document.getElementById('dosageModal');
const selectedMedName = document.getElementById('selectedMedName');
const menstrualEffectsList = document.getElementById('menstrualEffectsList');
const dosageAmount = document.getElementById('dosageAmount');
const dosageUnit = document.getElementById('dosageUnit');
const dosageFrequency = document.getElementById('dosageFrequency');
const saveDosageBtn = document.getElementById('saveDosageBtn');
const medicationSearch = document.getElementById('medicationSearch');
const searchBtn = document.getElementById('searchBtn');
const medicationList = document.getElementById('medicationList');

let selectedMedication = null;

// Show initial message
medicationList.innerHTML = '<p style="text-align: center; color: #666; padding: 4vh; font-size: 1.1em;">🔍 Type a medication name and press Search to see menstrual side effects</p>';

// Fetch menstrual effects for a specific drug
async function fetchMenstrualEffects(drugName) {
    try {
        const response = await fetch(`http://localhost:3000/api/drug/${encodeURIComponent(drugName)}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return { drug_name: drugName, menstrual_effects: [], effect_count: 0, notFound: true };
            }
            throw new Error('Failed to fetch menstrual effects');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching menstrual effects:', error);
        return { error: true, message: error.message };
    }
}

// Display search result
function displaySearchResult(drugData) {
    medicationList.innerHTML = '';
    
    if (drugData.error) {
        medicationList.innerHTML = `<p style="text-align: center; color: #ff5869; padding: 3vh;">❌ Error: ${drugData.message}<br><br>Make sure the server is running at http://localhost:3000</p>`;
        return;
    }
    
    if (drugData.notFound) {
        medicationList.innerHTML = `
            <div style="text-align: center; padding: 3vh;">
                <h3 style="color: #666; margin-bottom: 2vh;">⚠️ Medication Not Found</h3>
                <p style="color: #999;">"${drugData.drug_name}" is not in our database of 374 medications with menstrual side effects.</p>
                <p style="color: #999; margin-top: 1vh;">This could mean:</p>
                <ul style="list-style: none; padding: 0; color: #999;">
                    <li>• The medication doesn't have reported menstrual side effects</li>
                    <li>• Try searching for the generic name instead of brand name</li>
                    <li>• Check your spelling</li>
                </ul>
            </div>
        `;
        return;
    }
    
    // Create result card
    const resultCard = document.createElement('div');
    resultCard.style.cssText = `
        background: white;
        border: 2px solid #ff5869;
        border-radius: 20px;
        padding: 3vh 2vw;
        box-shadow: 0 6px 20px rgba(255, 88, 105, 0.15);
        max-width: 800px;
        margin: 0 auto;
    `;
    
    // Drug name header
    const header = document.createElement('h2');
    header.textContent = drugData.drug_name;
    header.style.cssText = `
        color: #ff5869;
        margin-bottom: 2vh;
        font-size: 2em;
        border-bottom: 2px solid #ff5869;
        padding-bottom: 1vh;
    `;
    resultCard.appendChild(header);
    
    // Menstrual effects section
    if (drugData.menstrual_effects && drugData.menstrual_effects.length > 0) {
        const effectsTitle = document.createElement('h3');
        effectsTitle.textContent = `⚠️ Reported Menstrual Side Effects (${drugData.effect_count})`;
        effectsTitle.style.cssText = `
            color: #333;
            margin-top: 2vh;
            margin-bottom: 1.5vh;
            font-size: 1.3em;
        `;
        resultCard.appendChild(effectsTitle);
        
        const effectsList = document.createElement('ul');
        effectsList.style.cssText = `
            list-style-type: disc;
            padding-left: 3vh;
            margin: 0;
        `;
        
        drugData.menstrual_effects.forEach(effect => {
            const li = document.createElement('li');
            li.textContent = effect;
            li.style.cssText = `
                margin-bottom: 1vh;
                color: #555;
                font-size: 1.05em;
                line-height: 1.6;
            `;
            effectsList.appendChild(li);
        });
        
        resultCard.appendChild(effectsList);
        
        // Disclaimer
        const disclaimer = document.createElement('p');
        disclaimer.textContent = '📋 Note: These effects are based on adverse event reports from the FDA database and may not occur in all patients. Always consult your healthcare provider.';
        disclaimer.style.cssText = `
            margin-top: 2vh;
            padding: 1.5vh;
            background-color: #fff5f6;
            border-left: 4px solid #ff5869;
            color: #666;
            font-size: 0.95em;
            border-radius: 5px;
            font-style: italic;
        `;
        resultCard.appendChild(disclaimer);
        
        // Add medication button
        const addButton = document.createElement('button');
        addButton.textContent = '+ Add to My Medications';
        addButton.style.cssText = `
            margin-top: 2vh;
            padding: 1.5vh 3vw;
            background-color: #ff5869;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;
        addButton.onmouseover = () => {
            addButton.style.backgroundColor = '#ff4056';
            addButton.style.transform = 'translateY(-2px)';
            addButton.style.boxShadow = '0 4px 15px rgba(255, 88, 105, 0.3)';
        };
        addButton.onmouseout = () => {
            addButton.style.backgroundColor = '#ff5869';
            addButton.style.transform = 'translateY(0)';
            addButton.style.boxShadow = 'none';
        };
        addButton.onclick = () => openDosageModal(drugData);
        resultCard.appendChild(addButton);
        
    } else {
        const noEffects = document.createElement('p');
        noEffects.textContent = 'ℹ️ No menstrual side effects reported for this medication in our database.';
        noEffects.style.cssText = `
            color: #666;
            font-size: 1.1em;
            padding: 2vh;
            background-color: #f5f5f5;
            border-radius: 10px;
            text-align: center;
        `;
        resultCard.appendChild(noEffects);
    }
    
    medicationList.appendChild(resultCard);
}

// Open dosage modal
function openDosageModal(drugData) {
    selectedMedication = drugData.drug_name;
    selectedMedName.textContent = drugData.drug_name;
    
    // Display menstrual effects
    displayMenstrualEffectsInModal(drugData);
    
    // Clear form
    dosageAmount.value = '';
    dosageUnit.value = '';
    dosageFrequency.value = '';
    
    dosageModal.style.display = 'flex';
    dosageModal.style.alignItems = 'center';
    dosageModal.style.justifyContent = 'center';
    console.log('Modal opened for:', drugData.drug_name);
}

// Display menstrual effects in modal
function displayMenstrualEffectsInModal(drugData) {
    menstrualEffectsList.innerHTML = '';
    
    if (!drugData.menstrual_effects || drugData.menstrual_effects.length === 0) {
        menstrualEffectsList.innerHTML = '<p style="color: #666;">ℹ️ No menstrual effects reported for this medication in our database.</p>';
        return;
    }
    
    const effectsTitle = document.createElement('h4');
    effectsTitle.textContent = `Reported Menstrual Effects (${drugData.effect_count}):`;
    effectsTitle.style.marginBottom = '1vh';
    effectsTitle.style.color = '#ff5869';
    menstrualEffectsList.appendChild(effectsTitle);
    
    const effectsUl = document.createElement('ul');
    effectsUl.style.listStyleType = 'disc';
    effectsUl.style.paddingLeft = '2vh';
    effectsUl.style.margin = '0';
    
    drugData.menstrual_effects.forEach(effect => {
        const li = document.createElement('li');
        li.textContent = effect;
        li.style.marginBottom = '0.5vh';
        li.style.color = '#333';
        effectsUl.appendChild(li);
    });
    
    menstrualEffectsList.appendChild(effectsUl);
    
    const disclaimer = document.createElement('p');
    disclaimer.textContent = 'Note: These effects are based on adverse event reports and may not occur in all patients.';
    disclaimer.style.fontSize = '0.9em';
    disclaimer.style.color = '#999';
    disclaimer.style.marginTop = '1vh';
    disclaimer.style.fontStyle = 'italic';
    menstrualEffectsList.appendChild(disclaimer);
}

// Close dosage modal
function closeDosageModal() {
    dosageModal.style.display = 'none';
    console.log('Modal closed');
}

// Show notification
function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isSuccess ? '#4caf50' : '#ff5869'};
        color: white;
        padding: 1.5vh 2vw;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Save dosage to database
async function saveDosageToDatabase(medication, amount, unit, frequency) {
    try {
        const response = await fetch('http://localhost:3000/api/user-medications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                medication: medication,
                amount: amount,
                unit: unit,
                frequency: frequency
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save medication');
        }
        
        const result = await response.json();
        console.log('Saved to database:', result);
        
        // Show success notification
        showNotification(`✅ ${medication} saved! View in "My Medications"`, true);
        
        return result;
    } catch (error) {
        console.error('Error saving medication:', error);
        
        if (error.message.includes('redirect') || error.message.includes('login')) {
            showNotification('⚠️ Please log in to save medications', false);
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showNotification('❌ Failed to save medication', false);
        }
    }
}

// Save dosage button
saveDosageBtn.addEventListener('click', async () => {
    if (selectedMedication && dosageAmount.value && dosageUnit.value && dosageFrequency.value) {
        console.log('Saving medication:', selectedMedication);
        
        await saveDosageToDatabase(
            selectedMedication, 
            dosageAmount.value, 
            dosageUnit.value,
            dosageFrequency.value
        );
        
        closeDosageModal();
    } else {
        alert('⚠️ Please fill in all fields (dose, unit, and frequency)');
    }
});

// Search functionality
async function searchMedication() {
    const searchTerm = medicationSearch.value.trim();
    
    if (!searchTerm) {
        medicationList.innerHTML = '<p style="text-align: center; color: #ff5869; padding: 3vh;">⚠️ Please enter a medication name</p>';
        return;
    }
    
    // Show loading state
    medicationList.innerHTML = '<p style="text-align: center; color: #666; padding: 3vh;">🔄 Searching for menstrual effects...</p>';
    
    // Fetch and display results
    const drugData = await fetchMenstrualEffects(searchTerm);
    displaySearchResult(drugData);
}

// Search on button click
searchBtn.addEventListener('click', searchMedication);

// Search on Enter key
medicationSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMedication();
    }
});

// Close modal when clicking outside
dosageModal.addEventListener('click', (e) => {
    if (e.target === dosageModal) {
        closeDosageModal();
    }
});

console.log('✅ Medication search initialized - ready to search database');