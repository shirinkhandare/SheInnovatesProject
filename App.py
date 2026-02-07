from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS  # allows frontend to call your API
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests from frontend

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["drug_database"]
collection = db["menstrual_effects"]

@app.route('/api/drug/<drug_name>')
def get_drug_effects(drug_name):
    result = collection.find_one({"drug_name": drug_name.upper()})
    if result:
        result.pop("_id")
        return jsonify(result)
    return jsonify({"error": "Drug not found"}), 404

@app.route('/api/search/<effect>')
def search_by_effect(effect):
    drugs = collection.find({"menstrual_effects": effect})
    results = [{"drug": d["drug_name"], "effects": d["menstrual_effects"]} 
                for d in drugs]
    return jsonify(results)

@app.route('/api/drugs')
def get_all_drugs():
    drugs = collection.find({}, {"drug_name": 1, "effect_count": 1, "_id": 0}).limit(100)
    return jsonify(list(drugs))

if __name__ == '__main__':
    app.run(debug=True)