import React from "react";

import {Redirect, Link} from "react-router-dom";
import DataUtil from "../utils/DataUtil";

export default class DevView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.tabs = [
            "Icons",
            "BrokenUnique"
        ]

        this.tabTitles = {
            "Icons": "Items without Icons",
            "BrokenUnique": "Broken Unique Effects"
        }

        this.state = {
            currentTab: this.tabs[0]
        }
    }

    componentDidMount() {
        this.setState({currentTab: this.props.match.params.tab || this.tabs[0]});
    }

    renderTabs() {
        return this.tabs.map(tab => (
            <li key={tab}
                className={tab === this.state.currentTab ? "is-active" : ""}
                onClick={() => this.setState({currentTab: tab})}>
                    <Link to={"/dev/" + tab}>{tab in this.tabTitles ? this.tabTitles[tab] : tab}</Link>
            </li>
        ))
    }

    renderIcons() {
        let weapons = Object.keys(DataUtil.data().weapons).filter(weaponName =>
            !("icon" in DataUtil.data().weapons[weaponName])).sort((a, b) =>
                a.localeCompare(b)).map(weaponName =>
                    <li key={weaponName}><a>{weaponName}</a></li>);

        let armours = Object.keys(DataUtil.data().armours).filter(armourName =>
            !("icon" in DataUtil.data().armours[armourName])).sort((a, b) =>
                a.localeCompare(b)).map(armourName =>
                    <li key={armourName}><a>{armourName}</a></li>);

        return <React.Fragment>
            <h3 className="title is-4">Items without icons</h3>

            <div className="columns">
                <div className="column">
                    <h4 className="title is-6">Weapons</h4>
                    <ul className="menu-list">
                        {weapons}
                    </ul>
                </div>
                <div className="column">
                    <h4 className="title is-6">Armours</h4>
                    <ul className="menu-list">
                        {armours}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    }

    renderBrokenUnique() {
        let weapons = Object.keys(DataUtil.data().weapons).filter(weaponName =>
            !("wip_unique_effects" in DataUtil.data().weapons[weaponName])).sort((a, b) =>
                a.localeCompare(b)).map(weaponName =>
                    <li key={weaponName}><a>{weaponName}</a></li>);

        let armours = Object.keys(DataUtil.data().armours).filter(armourName =>
            !("wip_unique_effects" in DataUtil.data().armours[armourName])).sort((a, b) =>
                a.localeCompare(b)).map(armourName =>
                    <li key={armourName}><a>{armourName}</a></li>);

        return <React.Fragment>
            <h3 className="title is-4">Items with Broken Unique Effect</h3>

            <div className="columns">
                <div className="column">
                    <h4 className="title is-6">Weapons</h4>
                    <ul className="menu-list">
                        {weapons}
                    </ul>
                </div>
                <div className="column">
                    <h4 className="title is-6">Armours</h4>
                    <ul className="menu-list">
                        {armours}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    }

    render() {
        if(localStorage.getItem("__db_developer_mode") !== "enabled") {
            return <Redirect to="/" />
        }

        if(this.tabs.indexOf(this.state.currentTab) === -1) {
            this.setState({currentTab: this.tabs[0]});
            return <Redirect to={"/dev/" + this.tabs[0]} />
        }

        console.log("Render Tab", this.state.currentTab);

        return <section className="section">
            <h3 className="subtitle"><i className="fas fa-code"></i> Developer Menu</h3>
            <div style={{marginBottom: "20px"}}>
                This menu offers you certain functionality that makes it easier to debug the application.
            </div>

            <div className="tabs">
                <ul>
                    {this.renderTabs()}
                </ul>
            </div>

            <div className="tab-content">
                {this["render" + this.state.currentTab]()}
            </div>
        </section>;
    }
}