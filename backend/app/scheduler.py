import os
import requests
from apscheduler.schedulers.background import BackgroundScheduler


def schedule(mongo, search_query='ipl 2024'):
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.start()

    def fetch_youtube_data():
        url = os.getenv('YOUTUBE_BASE_URL') + '/search'
        params = {
            'part': 'snippet',
            'q': search_query,
            'type': 'video',
            'order': 'date',
            'maxResults': 5,  # Adjust as needed
            'key': os.getenv('GCP_API_KEY'),
        }
        response = requests.get(url, params=params)
        videos = response.json().get('items', [])

        # Process and store each video in MongoDB
        for video in videos:
            video_data = {
                'title': video['snippet']['title'],
                'description': video['snippet']['description'],
                'publishedAt': video['snippet']['publishedAt'],
                'thumbnails': video['snippet']['thumbnails'],
                # Add any other fields as necessary
            }
            # Ensure unique insertion based on some unique attribute, e.g., videoId
            mongo.db.videos.update_one({'publishedAt': video_data['publishedAt']}, {'$set': video_data}, upsert=True)

    # Schedule the fetch_youtube_data task to run every 10 seconds
    scheduler.add_job(fetch_youtube_data, 'interval', seconds=10)
