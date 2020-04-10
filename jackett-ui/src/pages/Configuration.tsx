import * as React from "react";
import {connect} from "react-redux";
import {RootState} from "../store/reducers";
import {ServerConfig} from "../store/types/serverConfig";
import {TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import {Theme} from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import {ClassNameMap} from "@material-ui/styles/withStyles";
import withTheme from "@material-ui/core/styles/withTheme";

// TODO: remove unused styles
const useStyles = (theme: Theme) => ({
    paper: {
        padding: theme.spacing(2)
    }
});

interface State {
}

interface Props {
    config: ServerConfig
    classes: ClassNameMap
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config
    };
}

const mapDispatchToProps = {
}

class Configuration extends React.Component<Props, State> {

    componentDidMount() {

    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                    Payment method
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField required id="adminPassword" label="Admin password" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField required id="basePathOverride" label="Base Path Override" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField required id="expDate" label="Server Port" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            id="cvv"
                            label="CVV"
                            helperText="Last three digits on signature strip"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                            label="Remember credit card details for next time"
                        />
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withTheme(withStyles(useStyles)(connect(mapStateToProps, mapDispatchToProps)(Configuration)));
