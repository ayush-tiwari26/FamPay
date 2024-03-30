import React, {useEffect, useState} from 'react';
import {Box, Container, CardActionArea, Grid, Card, CardMedia, CardContent, Typography, Pagination} from '@mui/material';

const styles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'flex-start',
    },
    media: {
        height: 140,
        borderRadius: '4px',
    },
    cardContent: {
        overflow: 'hidden',
    },
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
    },
};

const App = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10; // Match with your backend page size
    const [totalPages, setTotalPages] = useState(0); // To hold the total number of pages
    const BACKEND_BASE_URL = 'http://localhost:5000';

    // Fetches the video data
    const fetchVideos = async () => {
        const response = await fetch(`${BACKEND_BASE_URL}/search/videos?page=${page}&size=${pageSize}`);
        const data = await response.json();
        setVideos(data);  // Now assuming your API directly returns an array of videos

        // Now fetch the total number of pages - assuming this endpoint exists and returns { total_pages: number }
        const pagesResponse = await fetch(`${BACKEND_BASE_URL}/total_pages?size=${pageSize}`);
        const pagesData = await pagesResponse.json();
        setTotalPages(pagesData.total_pages); // Assumed the API returns JSON { total_pages: number }
    };

    useEffect(() => {
        fetchVideos();
    }, [page]); // Fetch new data when the 'page' state changes

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    return (
        <Container>
        <Grid container spacing={3} sx={{ mt: 5 }}>
            {videos && videos.map && videos.map((video) => (
                <Grid item xs={12} md={4} lg={3} key={video._id}>
                    <Card sx={styles.card}>
                        <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <CardMedia
                                component="img"
                                image={video.thumbnails?.high?.url || 'https://via.placeholder.com/150'}
                                alt={video.title}
                                sx={styles.media}
                            />
                        </a>
                        <CardContent sx={styles.cardContent}>
                            <Typography gutterBottom variant="h6" sx={{
                                ...styles.title,
                                '&:hover': {
                                    color: 'blue',  // Blue text on hover
                                },
                            }}>
                                {video.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={styles.description}>
                                {video.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={totalPages} page={page} onChange={handleChangePage} />
        </Box>
    </Container>
    );
};

export default App;
