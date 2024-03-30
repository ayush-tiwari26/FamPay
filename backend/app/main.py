from flask import Flask, jsonify, request
from dotenv import load_dotenv
from scheduler import schedule
from db_setup import initialize_db

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config.update(
    TEMPLATES_AUTO_RELOAD=True
)


@app.route('/')
def hello_world():
    a = app.mongo_client.admin.command('ping')
    return 'Hello, World!' + str(a)


@app.route('/search/videos')
def search():
    search_query = request.args.get('keyword', 'ipl 2024')  # Default to 'ipl 2024' if not provided
    # For now using predefined search query
    # paginates the data inside mongodb in order of


if __name__ == '__main__':
    app.mongo_client = initialize_db()
    schedule(app.mongo_client)
    app.run()
