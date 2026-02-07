from pymongo import MongoClient
from flask import Flask, jsonify  # or use FastAPI

app = Flask(__name__) # create a Flask app instance
client = MongoClient("mongodb://localhost:27017/")
db = client["drug_database"] 
collection = db["menstrual_effects"]

@app.route('/drug/<drug_name>') 
def get_drug_effects(drug_name):
    result = collection.find_one({"drug_name": drug_name.upper()}) # search mongoDB to the user's desired drug
    if result:
        result.pop("_id")  # remove MongoDB ID
        return jsonify(result) # return drug data as JSON
    return jsonify({"error": "Drug not found"}), 404

@app.route('/search/<effect>')
def search_by_effect(effect):
    drugs = collection.find({"menstrual_effects": effect}) # finds all drugs that have this specific menstrual effect
    results = [{"drug": d["drug_name"], "effects": d["menstrual_effects"]} # creates a list of results
                for d in drugs]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True) # starts the web server