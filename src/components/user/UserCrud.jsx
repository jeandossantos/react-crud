import React, { Component } from 'react';
import axios from 'axios';

import Main from '../template/Main';
import RenderTable from './RenderTable';
import RenderForm from './RenderForm';

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Exluir.'
};

const baseUrl = "http://localhost:3001/users";
const initialState = {
    user: { name: '', email: '' },
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState };

    UNSAFE_componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data });
        })
    }

    clear() {
        this.setState({ user: initialState.user });
    }

    save() {
        //clonar o state se for fazer alteções
        const user = this.state.user;
        const method = user.id ? 'put' : 'post';
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;
        axios[method](url, user).then(resp => {
            const list = this.getUpdateList(resp.data);
            this.setState({ user: initialState.user, list });
        });
    }

    getUpdateList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id);
        if (add) list.unshift(user);
        return list;
    }

    updateField(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }

    load(user) {
        this.setState({ user });
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdateList(user, false);
            this.setState({ list });
        });
    }

    render() {
        const list = this.state.list;
        return (
            <Main {...headerProps} >
                <RenderForm user={this.state.user} save={this.save.bind(this)} clear={this.clear.bind(this)}
                    updateField={this.updateField.bind(this)} />
                <RenderTable list={list} load={this.load.bind(this)} remove={this.remove.bind(this)} />
            </Main>
        )
    }
}
