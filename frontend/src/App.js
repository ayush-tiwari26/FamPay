import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Pagination, InputLabel, Select, MenuItem, FormControl
} from '@mui/material';

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
    const [sortCriteria, setSortCriteria] = useState('publishedAt'); // Default sort by publishedAt
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 12;
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


    videos.sort((a, b) => {
        if (sortCriteria === 'title') {
            return a.title.localeCompare(b.title);
        }
        return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return (
        <Container sx={{flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Grid container spacing={3} sx={{mt: '3%', mb: '10%'}}>
                {videos && videos.map && videos.map((video) => (
                    <Grid item xs={12} md={4} lg={3} key={video._id}>
                        <Card sx={styles.card}>
                            <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank"
                               rel="noopener noreferrer" style={{textDecoration: 'none'}}>
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
            <Box
                sx={{
                    position: 'fixed',
                    height: '15%',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    zIndex: 999,
                }}
            >
                <FormControl variant="outlined" sx={{width: 200, mb: 2, mt: 2, mr: 25}}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortCriteria}
                        onChange={(e) => setSortCriteria(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="publishedAt">Publish Date</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                    </Select>
                </FormControl>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="large"
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Container>
    );
};

export default App;
