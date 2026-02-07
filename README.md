# SheInnovatesProject
Project
created by Nandin-Erdene Molomjamts, Lan Nguyen, Shirin Khandare, Veronika Makowski

The goal of MEDstruation is to provide user-friendly experience for women to track their menstruation cycle, learn about the potential side effects of their medication in simplified and understandable manner. 

This is the link to the Google Drive that contains the data/ folder:
https://drive.google.com/drive/folders/1bcOpWSFr3REJmCW4WK9dQTUDvXipOGsj?usp=drive_link


## Setup Instructions for MongoDB

1. Pull the repository

2. Install dependencies:
```bash
   npm install
   python -m pip install requirements.txt 
```

3. Create a `.env` file:
```bash
   cp .env.example .env
```

4. Ask me for the MongoDB connection string. DO NOT share it publically. Add it to `.env` 

5. Download data from [Google Drive](https://drive.google.com/drive/folders/1bcOpWSFr3REJmCW4WK9dQTUDvXipOGsj) and place in `data/` folder

6. Run data processing (one-time):
```bash
   python OpenFDA_API.py
```

7. Start the API server:
```bash
   python App.py
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DATA_DIR`: Path to data folder (default: `./data`)
```