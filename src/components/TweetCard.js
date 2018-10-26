import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContent from '@material-ui/core/CardContent';


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


function TweetCard(props) {
    const { classes } = props;

    return (
        <Card className={classes.card}>
            {props.loading ? <CircularProgress className={classes.progress} /> : <CardContent dangerouslySetInnerHTML={{ __html: props.tweet }}></CardContent>}
        </Card>
    );
}

TweetCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TweetCard);