import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'


const styles = {
    card: {
        maxWidth: 345,
        margin: 10,
        float: 'left',
    },
    media: {
        objectFit: 'cover',
    },
};

function WeatherCard(props) {
    const { classes } = props;
    return (
        <Card className={classes.card}>
            {props.loading ?
                <CircularProgress className={classes.progress} />
                :
                <CardActionArea>
                    <CardMedia
                        component="img"
                        className={classes.media}
                        image={props.picture_url}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h2">
                            {props.temp} °C
                    </Typography>
                        <Typography component="p">
                            {props.desc}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            }
        </Card>
    );
}

WeatherCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WeatherCard);