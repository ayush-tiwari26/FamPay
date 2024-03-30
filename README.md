# FamPay

1. Built using Flask, utilizes MongoDB as database, and PyMongo as the driver.
2. Consume Youtube API directly (did not require use of any third-party libraries).
3. Core Features Completed
   - [x] Continuous background process to fetch latest videos from YouTube API with a predefined search query.
   - [x] Storage of video data in a database with fields including video title, description, publishing datetime, thumbnails URLs, etc.
   - [x] Paginated GET API to retrieve stored video data, sorted in descending order of publishing datetime.

4. Additional Features also Completed
   - [x] Support for supplying multiple API keys for automatic switching when quota is exhausted.
   - [x] Scalability and optimization considerations for the API and database.
   - [x] Dashboard for viewing stored videos with sorting options.

## Backend
Built using Flask, to demonstrate API usage and pagination capabilities.

>Make sure to setup .env file with the following keys in destination `./backend/`. 
> For now the .env file is along the source with all keys!
>```bash
>GCP_API_KEY=<API_KEY>
>YOUTUBE_BASE_URL=<API_URL>
>MONGO_URI=<MONGO_URI>


Usage
```bash
cd backend/
pip install -r requirements.txt
flask --app .\app\main.py --debug run 
```
>Runs on: http://localhost:5000/

## Frontend
Built using React.js, to demonstrate API usage and pagination capabilities.

Usage
```bash
cd frontend/
npm install
npm start
```

>Runs on: http://localhost:3000/


