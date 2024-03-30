from flask import Flask, jsonify, request
from dotenv import load_dotenv
from scheduler import schedule
from db_setup import initialize_db
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config.update(
    TEMPLATES_AUTO_RELOAD=True
)

PAGINATION_SIZE = 12


@app.route('/')
def hello_world():
    a = app.mongo_client.admin.command('ping')
    return 'Hello, World!' + str(a)


@app.route('/search/videos')
def search():
    # Default to page 1 if not provided, and default size per page is 10
    page = int(request.args.get('page', 1))
    size = int(request.args.get('size', PAGINATION_SIZE))

    # Calculating the number of documents to skip
    skip = (page - 1) * size

    # Fetching videos from MongoDB, sorted by the latest first
    video_cursor = app.mongo_client.db.videos.find().sort('publishedAt', -1).skip(skip).limit(size)
    videos = list(video_cursor)

    # Converting MongoDB ObjectId() to string for JSON serialization
    for video in videos:
        video['_id'] = str(video['_id'])

    return jsonify(videos)


@app.route('/total_pages')
def total_pages():
    size = int(request.args.get('size', PAGINATION_SIZE))

    # Fetching the total number of videos/documents in the collection
    total_videos = app.mongo_client.db.videos.count_documents({})

    # Calculating total pages
    total_pages = (total_videos + size - 1) // size  # Ensure result is an integer

    return jsonify({'total_pages': total_pages})


if __name__ == '__main__':
    app.mongo_client = initialize_db()
    schedule(app.mongo_client)
    app.run(debug=True)
