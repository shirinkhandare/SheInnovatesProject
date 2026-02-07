from collections import defaultdict
import json, os # read json files and load file systems
from pymongo import MongoClient

MENSTRUATION_TERMS = {
    # menstruation/cycle terms
    "Amenorrhoea", "Menstrual disorder", "Menorrhagia", "Dysmenorrhoea", "Metrorrhagia", "Menometrorrhagia",
    "Heavy menstrual bleeding", 
    
    # irregular bleeding 
    "Vaginal haemorrhage", "Uterine haemorrhage", "Genital haemorrhage",  
    "Abnormal uterine bleeding", "Intermenstrual bleeding", "Postmenopausal haemorrhage",
    
    # flow changes
    "Menstruation irregular", "Menstruation delayed", "Menstruation early", 
    "Menstruation absent", "Menstruation prolonged", "Menstruation increased", 
    "Menstruation decreased",
    
    # hormonal/ovulatory terms
    "Ovulation disorder", "Anovulatory cycle", "Hormone level abnormal", 
    "Oestrogen deficiency", "Progesterone deficiency",
    
    # pain and premenstrual symptoms
    "Pelvic pain", "Lower abdominal pain", "Premenstrual syndrome", 
    "Premenstrual dysphoric disorder",
    
    # pregnancy-adjacent
    "Vaginal bleeding", "Uterine contractions"
}

client = MongoClient("mongodb://localhost:27017/")
db = client["drug_database"] # database name
collection = db["menstrual_effects"] # collection name

collection.delete_many({})

DATA_DIR = "data" # data folder where json files are held in 
MAX_REPORTS_PER_FILE = 10000  # files are too large, program will run extremely slow so just take the first 10000 reports
drug_effects = defaultdict(set) # store reactions in a set in each drug

files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json")] # get list of all json files in the data folder
total_files = len(files)  # total number of files to process


for file_num, filename in enumerate(files, 1): 
    print(f"Reading files... {len(drug_effects)} drugs found")

    
    with open(os.path.join(DATA_DIR, filename), "r", encoding="utf-8") as f: # open and load the json file
        data = json.load(f)  # parse the json file into a dictionary
    
    # get reports from this file 
    results = data.get("results", [])[:MAX_REPORTS_PER_FILE] # get results, [] if it does not exist. take all reports up until 10000 reports

    for report in results:
        patient = report.get("patient", {})  # get patient data

        # find menstruation-related reactions for this patient
        reactions = {
            r.get("reactionmeddrapt")  # get reaction name
            for r in patient.get("reaction", [])  # loop through reactions
            if r.get("reactionmeddrapt") in MENSTRUATION_TERMS  # filter for menstrual terms
        }

        # skip if no menstruation reactions found
        if not reactions:
            continue

        # check which drugs the patient was taking
        for drug in patient.get("drug", []):
            if drug.get("drugcharacterization") == "1": # API classifies suspect drugs as "1", suspect meaning drug that likely caused the side effect
                name = drug.get("medicinalproduct")  # get drug name
                if name:
                    for reaction in reactions:
                        drug_effects[name.upper()].add(reaction)  

documents = []
for drug, effects in drug_effects.items():
    documents.append({
        "drug_name": drug, 
        "menstrual_effects": sorted(list(effects)),
        "effect_count": len(effects)
    })

if documents:
    collection.insert_many(documents)
    print(f"Inserted {len(documents)} drug into MongoDB")

client.close() # close connection

# print final count on new line
# print(f"\rReading files... Complete! {len(drug_effects)} drugs found")

# have to convert set to list to support json files
# drug_effects_dict = {
#     drug: sorted(list(effects))  # turn set into list
#     for drug, effects in drug_effects.items() 
# }

# save to json file for searching database
# with open("drug_menstrual_effects.json", "w", encoding="utf-8") as f: # save json file as f
#     json.dump(drug_effects_dict, f, indent=2) # save the dictionary in f


# # Print final summary
# # print(f"Data saved!")

# print(json.dumps(drug_effects_dict))