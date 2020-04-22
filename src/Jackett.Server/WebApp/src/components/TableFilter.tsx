import * as React from "react";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

interface Props {
    inputData: any[]
    filterColumns: string[]
    resetTextOnDataChange: boolean
    className: string
    onFilter: ((outputData: any[]) => void)
}

interface State {
    prevInputData: any[]
    isFiltered: boolean
    filterText: string
}

class TableFilter extends React.Component<Props, State> {
    filterTimeout: any = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            prevInputData: [],
            isFiltered: false,
            filterText: ""
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
        let nextState = {} as State;
        if (prevState.prevInputData !== nextProps.inputData) {
            // if the input data changes
            nextState.prevInputData = nextProps.inputData;
            nextState.isFiltered = false;
            if (nextProps.resetTextOnDataChange) {
                nextState.filterText = "";
            }
        }
        return nextState;
    }

    onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // we have a small timeout for performance
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        this.filterTimeout = setTimeout(() => this.filterData(), 150);
        this.setState({filterText: event.target.value})
    }

    filterData = () => {
        // nothing to filter
        if (!this.state.filterText) {
            // call parent callback
            this.props.onFilter(this.props.inputData);
            return;
        }

        // remove empty words and words with operator only
        const filterTerms = this.state.filterText.toLowerCase().split(" ")
            .filter(term => !(!term || term === "+" || term === "-"));

        // split terms in positives (include) and negatives (exclude)
        let positiveTerms: string[] = [];
        let negativeTerms: string[] = [];
        filterTerms.forEach(term => {
            const operator = term.charAt(0); // supported operators => + and -
            if (operator === "-") {
                negativeTerms.push(term.slice(1)); // -hello => hello
            } else if (operator === "+") {
                positiveTerms.push(term.slice(1)); // +world => world // +-hello => -hello
            } else {
                positiveTerms.push(term);
            }
        });

        // filter rows
        const outputData = this.props.inputData.filter(row => {
            // merge all columns
            let fullText = "";
            this.props.filterColumns.forEach(column => {
                fullText += " " + row[column];
            })
            fullText = fullText.trim().toLowerCase();

            // search positive and negative terms
            for (let i = 0; i < positiveTerms.length; i++) {
                if (!fullText.includes(positiveTerms[i])) {
                    return false;
                }
            }
            for (let i = 0; i < negativeTerms.length; i++) {
                if (fullText.includes(negativeTerms[i])) {
                    return false;
                }
            }
            return true;
        });

        // call parent callback
        this.props.onFilter(outputData);
    }

    componentDidUpdate() {
        if (!this.state.isFiltered) {
            // only filter if required
            this.filterData();
            this.setState({isFiltered: true});
        }
    }

    render() {
        return (
            <Input
                placeholder="Search filter"
                allowClear
                prefix={<SearchOutlined />}
                className={this.props.className}
                value={this.state.filterText}
                onChange={this.onFilterChange}
            />
        );
    }

}

export default TableFilter;
