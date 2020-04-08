import * as React from "react";
import {Link, withRouter} from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";

interface Props extends RouteComponentProps {
    path: string,
    label: string,
    icon: React.ReactElement
}

export class SideBarItem extends React.Component<Props, {}> {

    render() {
        return (
            <Link to={{pathname: this.props.path}}>
                <ListItem button key={this.props.label} selected={this.shouldBeHighlighted()}>
                    <ListItemIcon>{this.props.icon}</ListItemIcon>
                    <ListItemText primary={this.props.label} />
                </ListItem>
            </Link>
        );
    }

    shouldBeHighlighted() {
        const {pathname} = this.props.location;
        if (this.props.path === '/') {
            return pathname === this.props.path;
        }
        return pathname.includes(this.props.path);
    }

}

export default withRouter(SideBarItem);
