import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
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

function PictureCard(props) {
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
            </CardActionArea>
        }
        </Card>
    );
}

PictureCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PictureCard);