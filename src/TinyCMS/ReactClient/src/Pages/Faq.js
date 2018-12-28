/* eslint-disable react/no-multi-comp */
import React from 'react';
import { createLinkWrapper } from "react-cms-link";
import { questionCategories, convertToNodes } from './questions.js';

class Category extends React.Component {
    onChange = (idx, answer) => {
        const { selected } = this.props;
        selected[idx] = answer;
        this.props.onChange(this.props.idx, selected);
    }
    onMultipleChange = (idx, answer, value) => {
        const { selected } = this.props;
        let current = selected[idx] || [];
        if (value)
            current.push(answer);
        else {
            var oldIdx = current.indexOf(answer);
            current.splice(oldIdx, 1);
        }
        selected[idx] = current;
        this.props.onChange(this.props.idx, selected);
    }
    render() {
        const { category, questions, selected } = this.props;
        return (
            <div className="category">
                <h1>{category}</h1>
                {questions.map(({ q, a }, idx) => {
                    const isArray = Array.isArray(a);
                    return isArray
                        ? <Question selected={selected[idx] || {}} idx={idx} key={idx} question={q} answer={a} onChange={this.onChange} />
                        : <SingleQuestion selected={selected[idx] || []} idx={idx} key={idx} val={a} onChange={this.onMultipleChange} />
                })}
            </div>
        );
    }
}

class SingleQuestion extends React.Component {
    render() {
        const { val, idx, onChange } = this.props;
        const selected = this.props.selected.indexOf(val) !== -1;
        return (
            <button onClick={() => {
                onChange(idx, val, !selected);
            }} className={'btn btn-primary' + (selected ? ' active' : '')}>{val}</button>
        );
    }
}

class Question extends React.Component {
    render() {
        const { question, answer, onChange, selected, idx } = this.props;
        const isArray = Array.isArray(answer);

        return (
            <div className="questionlist">
                <h3>{question}</h3>
                <div className="question btn-spacing">
                    {isArray && answer.map(({ val, bg, points }, aidx) => {
                        return (
                            <button onClick={() => {
                                onChange(idx, val);
                            }} className={'btn btn-primary' + (selected === val ? ' active' : '')} key={aidx}>{val}</button>
                        );
                    })}

                </div>
            </div>
        );
    }
}

const getPoints = (answers, question) => {
    var ret = 0;
    if (Array.isArray(question.a)) {
        var obj = question.a.find(d => d.val === answers);
        if (obj && obj.points)
            ret = obj.points;
    }
    else if (question.points) {
        if (answers.indexOf(question.a) !== -1)
            ret = question.points;
    }
    return ret;
}

export default createLinkWrapper(class Faq extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selection: {}, totalPoints: 0, sectionPoints: [] };

        
    }
    selectionChanged = (idx, value) => {
        const selection = { ...this.state.selection, [idx]: value };
        this.setState({ selection });
        this.generateResult();
    }
    generateResult = () => {
        const { selection } = this.state;
        var ret = {};
        var sectionPoints = [];
        var totalPoints = 0;
        questionCategories.forEach((cat, catNr) => {
            var returnCat = { category: cat.category, answer: {}, points: 0 };
            var answers = selection[catNr] || {};
            cat.questions.forEach((question, questionId) => {
                var mappedAnswer = answers[questionId];
                if (mappedAnswer) {
                    const points = getPoints(mappedAnswer, question);
                    returnCat.points += points;
                    returnCat.answer[questionId] = {
                        q: question.q,
                        a: mappedAnswer,
                        points
                    };
                }
            });
            if (Object.keys(returnCat.answer).length > 0) {
                ret[cat.category] = returnCat;
                sectionPoints.push({ name: cat.category, points: returnCat.points });
                totalPoints += returnCat.points;
                console.log(cat.category, returnCat.points);
            }
        });
        this.setState({ sectionPoints, totalPoints });
    }
    render() {
        const { name } = this.props;
        const { selection = {}, sectionPoints, totalPoints } = this.state;
        return (
            <div>
                <div className="container">
                    <h1>{name}</h1>
                    {this.props.children}
                    {questionCategories.map(({ category, questions }, idx) => {
                        return (<Category key={idx} idx={idx} selected={selection[idx] || {}} onChange={this.selectionChanged} category={category} questions={questions} />);
                    })}
                    <button className="btn btn-primary" onClick={()=>{console.log(JSON.stringify(convertToNodes()));}}>Convert to nodes</button>
                </div>
                <div className="sum-container">
                    <ul>
                        {sectionPoints.map(({ name, points }) => (<li key={name}><strong>{name}</strong>&nbsp;<snap>{points} points</snap></li>))}
                    </ul>
                    <h3>Total: {totalPoints}</h3>
                </div>
            </div>
        );
    }
},
    ({ name }) => ({ name }));
