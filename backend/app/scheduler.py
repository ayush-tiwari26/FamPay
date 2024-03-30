import os
from datetime import timedelta, datetime

import requests
from apscheduler.schedulers.background import BackgroundScheduler


def schedule(mongo, search_query='cricket'):
    scheduler = BackgroundScheduler(daemon=True)
    scheduler.start()

    def fetch_youtube_data():
        # Configs
        published_after = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        # Retry mechanism for fetching YouTube data using multiple keys, in case of API key quota limits
        gcp_keys = os.getenv('GCP_API_KEY').split(',')
        current_gcp_key_index = 0
        attempted_gcp_keys = 0

        url = os.getenv('YOUTUBE_BASE_URL') + '/search'
        response = None
        while attempted_gcp_keys <= len(gcp_keys):
            params = {
                'part': 'snippet',
                'q': search_query,
                'type': 'video',
                'order': 'date',
                'publishedAfter': published_after,  # Videos published after the calculated time
                'maxResults': 5,  # Fetch up to 50 videos
                'key': gcp_keys[current_gcp_key_index],
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                published_after = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%dT%H:%M:%SZ');
                break
            else:
                attempted_gcp_keys = attempted_gcp_keys + 1;
                current_gcp_key_index = (current_gcp_key_index + 1) % len(gcp_keys)

            if attempted_gcp_keys == len(gcp_keys):
                raise Exception(f"Failed to fetch YouTube data, API responded with status code: {response.status_code}")

        videos = response.json().get('items', [])

        # Process and store each video in MongoDB
        for video in videos:
            video_data = {
                '_id': video['id']['videoId'],  # Use YouTube's videoId as MongoDB's _id for uniqueness
                'title': video['snippet']['title'],
                'description': video['snippet']['description'],
                'publishedAt': video['snippet']['publishedAt'],
                'thumbnails': video['snippet']['thumbnails'],  # Contains URLs for various thumbnail sizes
                'channelId': video['snippet']['channelId'],  # Unique identifier for the channel
                'channelTitle': video['snippet']['channelTitle'],  # Name of the channel
                'liveBroadcastContent': video['snippet']['liveBroadcastContent'],
            }
            # Ensure unique insertion based on unique _id attribute
            mongo.db.videos.update_one({'_id': video_data['_id']}, {'$set': video_data}, upsert=True)

        print(f"Inserted {len(videos)} videos into MongoDB")

    # Schedule the fetch_youtube_data task to run every 10 seconds
    scheduler.add_job(fetch_youtube_data, 'interval', seconds=10)
